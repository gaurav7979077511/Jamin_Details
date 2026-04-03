import { MemberService } from '../../application/services/member.service.js';

const memberService = new MemberService();

export const getMembers = async (_req, res) => {
  const data = await memberService.listMembers();
  res.json(data);
};

export const createMember = async (req, res) => {
  try {
    const data = await memberService.createMember(req.body, req.user);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMember = async (req, res) => {
  try {
    const data = await memberService.updateMember(req.params.id, req.body, req.user);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const data = await memberService.deleteMember(req.params.id, req.body.strategy, req.body.reassignTo, req.user);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
