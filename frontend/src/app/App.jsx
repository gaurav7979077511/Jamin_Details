import { useMemo, useState } from 'react';
import ReactFlow, { Background, Controls } from 'react-flow-renderer';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useTreeStore } from '../store/treeStore';
import { makeFlow } from '../utils/tree';
import TreeNodeCard from '../components/tree/TreeNodeCard';
import Modal from '../components/common/Modal';

const loginRequest = (payload) => api.post('/login', {
  ...payload,
  email: payload.email.trim().toLowerCase()
}).then((r) => r.data);

export default function App() {
  const queryClient = useQueryClient();
  const { user, token, setAuth, logout } = useAuthStore();
  const { collapsed, toggleNode, collapseAll, expandAll } = useTreeStore();
  const [form, setForm] = useState({ email: 'editor@example.com', password: 'password123' });
  const [memberForm, setMemberForm] = useState({ id: '', name: '', hindiName: '', isLate: false, parentId: '' });
  const [memberModal, setMemberModal] = useState({ open: false, mode: 'create' });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedViewId, setSelectedViewId] = useState('');

  const canEdit = user?.role === 'editor';

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => setAuth(data),
    onError: (e) => toast.error(e.response?.data?.message || 'Login failed')
  });

  const members = useQuery({ queryKey: ['members'], queryFn: () => api.get('/members').then((r) => r.data), enabled: Boolean(token) });
  const views = useQuery({ queryKey: ['views'], queryFn: () => api.get('/views').then((r) => r.data), enabled: Boolean(token) });
  const distribution = useQuery({
    queryKey: ['distribution', selectedViewId],
    queryFn: () => api.get(`/distribution/${selectedViewId}`).then((r) => r.data),
    enabled: Boolean(token && selectedViewId)
  });

  const distMap = useMemo(() => Object.fromEntries((distribution.data || []).map((d) => [d.personId, d.rakba])), [distribution.data]);

  const flowData = useMemo(() => makeFlow(members.data || [], collapsed, distMap), [members.data, collapsed, distMap]);

  const createMember = useMutation({
    mutationFn: (payload) => api.post('/members', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      setMemberModal({ open: false, mode: 'create' });
    }
  });

  const updateMember = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/members/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      setMemberModal({ open: false, mode: 'edit' });
    }
  });

  const deleteMember = useMutation({
    mutationFn: ({ id, strategy, reassignTo }) => api.delete(`/members/${id}`, { data: { strategy, reassignTo } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members'] })
  });

  const previewDistribution = useQuery({
    queryKey: ['preview', selectedViewId],
    queryFn: () => api.get(`/distribution/preview/${selectedViewId}`).then((r) => r.data),
    enabled: Boolean(previewOpen && selectedViewId)
  });

  const applyDistribution = useMutation({
    mutationFn: () => api.post('/distribution/apply', { viewId: selectedViewId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distribution', selectedViewId] });
      toast.success('Distribution applied');
      setPreviewOpen(false);
    }
  });

  const nodeTypes = {
    default: ({ data }) => (
      <TreeNodeCard
        data={data}
        collapsed={Boolean(collapsed[data.person._id])}
        onToggle={toggleNode}
        canEdit={canEdit}
        onAdd={(parentId) => {
          setMemberForm({ id: '', name: '', hindiName: '', isLate: false, parentId });
          setMemberModal({ open: true, mode: 'create' });
        }}
        onEdit={(person) => {
          setMemberForm({ id: person._id, name: person.name, hindiName: person.hindiName, isLate: person.isLate, parentId: person.parentId || '' });
          setMemberModal({ open: true, mode: 'edit' });
        }}
        onDelete={(person) => {
          if (person.isRoot) return toast.error('Root cannot be deleted');
          const strategy = window.confirm('OK = delete subtree, Cancel = reassign children to parent') ? 'subtree' : 'reassign';
          deleteMember.mutate({ id: person._id, strategy, reassignTo: person.parentId });
        }}
      />
    )
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
          <h1 className="text-xl font-semibold mb-4">Vanshawali Login</h1>
          <input className="border rounded p-2 w-full mb-2" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
          <input className="border rounded p-2 w-full mb-3" type="password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" onClick={() => loginMutation.mutate(form)}>Login</button>
        </div>
      </div>
    );
  }

  const totalByPerson = Object.entries(distMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white p-3 rounded-xl shadow flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Vanshawali Land & Family Tree Management</h1>
          <p className="text-sm text-slate-500">Logged in as {user.name} ({user.role})</p>
        </div>
        <button className="px-3 py-1 bg-slate-200 rounded" onClick={logout}>Logout</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-white p-3 rounded-xl shadow lg:col-span-1 space-y-3">
          <h2 className="font-semibold">Controls</h2>
          <button className="w-full px-2 py-1 bg-slate-200 rounded" onClick={() => collapseAll(flowData.allIds || [])}>Collapse All</button>
          <button className="w-full px-2 py-1 bg-slate-200 rounded" onClick={expandAll}>Expand All</button>

          <h3 className="font-semibold pt-2">Land Views</h3>
          <select className="w-full border rounded p-2" value={selectedViewId} onChange={(e) => setSelectedViewId(e.target.value)}>
            <option value="">Select view</option>
            {(views.data || []).map((view) => <option key={view._id} value={view._id}>{view.name}</option>)}
          </select>
          {canEdit && selectedViewId && <button className="w-full px-2 py-1 bg-indigo-500 text-white rounded" onClick={() => setPreviewOpen(true)}>Preview Recalculation</button>}

          <h3 className="font-semibold pt-2">Dashboard (Top Shares)</h3>
          <ul className="text-sm space-y-1 max-h-48 overflow-auto">
            {totalByPerson.map(([id, val]) => {
              const p = (members.data || []).find((m) => m._id === id);
              return <li key={id}>{p?.name || id}: {val.toFixed(2)}</li>;
            })}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow lg:col-span-3 h-[75vh]">
          <ReactFlow nodes={flowData.nodes} edges={flowData.edges} nodeTypes={nodeTypes} fitView>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>

      <Modal title={memberModal.mode === 'create' ? 'Add Member' : 'Edit Member'} open={memberModal.open} onClose={() => setMemberModal({ open: false, mode: 'create' })}>
        <div className="space-y-2">
          <input className="border rounded p-2 w-full" placeholder="ID (optional)" value={memberForm.id} onChange={(e) => setMemberForm((s) => ({ ...s, id: e.target.value }))} />
          <input className="border rounded p-2 w-full" placeholder="Name" value={memberForm.name} onChange={(e) => setMemberForm((s) => ({ ...s, name: e.target.value }))} />
          <input className="border rounded p-2 w-full" placeholder="Hindi Name" value={memberForm.hindiName} onChange={(e) => setMemberForm((s) => ({ ...s, hindiName: e.target.value }))} />
          <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={memberForm.isLate} onChange={(e) => setMemberForm((s) => ({ ...s, isLate: e.target.checked }))} /> Is Late</label>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => {
              if (memberModal.mode === 'create') createMember.mutate(memberForm);
              else updateMember.mutate({ id: memberForm.id, payload: memberForm });
            }}
          >Save</button>
        </div>
      </Modal>

      <Modal title="Distribution Preview (Manual Apply Required)" open={previewOpen} onClose={() => setPreviewOpen(false)}>
        <div className="max-h-80 overflow-auto text-sm">
          {(previewDistribution.data || []).map((item) => <div key={item.personId}>{item.personId}: {item.rakba.toFixed(4)}</div>)}
        </div>
        {canEdit && <button className="mt-3 px-3 py-1 bg-green-600 text-white rounded" onClick={() => applyDistribution.mutate()}>Apply</button>}
      </Modal>
    </div>
  );
}
