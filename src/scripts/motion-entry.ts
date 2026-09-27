import './editorial';
// Static imports execute all initial-state writes in this same task, before paint.
if (document.documentElement.dataset.motion === 'pending')
  document.documentElement.dataset.motion = 'ready';
