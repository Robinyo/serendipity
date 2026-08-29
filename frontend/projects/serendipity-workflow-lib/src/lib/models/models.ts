export interface ActivityModel {
  id?: string;
  type?: string;
  subject?: string;
  regarding?: string;
  priority?: string;
  startDate?: string;
  dueDate?: string;
}

export function createDefaultActivityModel(): ActivityModel {
  return {
    id: '',
    type: '',
    subject: '',
    regarding: '',
    priority: '',
    startDate: '',
    dueDate: '',
  };
}
