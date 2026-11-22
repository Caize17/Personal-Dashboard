import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Trash2,
  CheckCircle,
  ExternalLink,
  Calendar,
  Layers,
  ListTodo,
  CheckCircle2,
  PlayCircle,
  Pencil,
  X,
  FileText,
  ArrowRight,
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import TimePicker, { compareScheduleTimes } from '../TimePicker';

export default function AcademicView() {
  const {
    data,
    toggleAssignment,
    updateAssignmentStatus,
    deleteAssignment,
    addScheduleSlot,
    updateScheduleSlot,
    deleteScheduleSlot,
    deleteAcademicResource,
    setActiveModal,
    searchQuery
  } = useDashboard();

  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' | 'assignments' | 'resources'
  const [assignmentViewMode, setAssignmentViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [editingSlot, setEditingSlot] = useState(null); // slot being edited
  const [dragOverCol, setDragOverCol] = useState(null);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  // Filtered assignments
  const filteredAssignments = data.academic.assignments.filter((asg) => {
    if (
      searchQuery &&
      !asg.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !asg.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (priorityFilter !== 'all' && asg.priority !== priorityFilter) {
      return false;
    }
    return true;
  });

  // Filtered resources
  const filteredResources = data.academic.resources.filter((res) => {
    if (
      searchQuery &&
      !res.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !res.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(res.notes && res.notes.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  // Stats calculation
  const totalAssignments = data.academic.assignments.length;
  const pendingAssignments = data.academic.assignments.filter((a) => a.status !== 'completed');
  const completedAssignments = data.academic.assignments.filter((a) => a.status === 'completed');
  const highPriorityPending = pendingAssignments.filter((a) => a.priority === 'high').length;

  // Kanban column definitions
  const kanbanColumns = [
    {
      id: 'pending',
      title: 'To Do',
      icon: <ListTodo size={16} color="#4f46e5" />,
      iconBg: 'rgba(99, 102, 241, 0.12)',
      color: '#4f46e5',
      items: filteredAssignments.filter((a) => !a.status || a.status === 'pending')
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      icon: <PlayCircle size={16} color="#d97706" />,
      iconBg: 'rgba(245, 158, 11, 0.12)',
      color: '#d97706',
      items: filteredAssignments.filter((a) => a.status === 'in-progress')
    },
    {
      id: 'completed',
      title: 'Completed',
      icon: <CheckCircle2 size={16} color="#059669" />,
      iconBg: 'rgba(16, 185, 129, 0.12)',
      color: '#059669',
      items: filteredAssignments.filter((a) => a.status === 'completed')
    }
  ];

  // Drag and Drop handlers
  const handleDragStart = (e, asgId) => {
    e.dataTransfer.setData('text/plain', asgId);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    setDragOverCol(null);
    const asgId = e.dataTransfer.getData('text/plain');
    if (asgId) {
      updateAssignmentStatus(asgId, colId);
    }
  };



  return (
    <div className="view-container">
      {/* Academic Stats - Clean & Focused without GPA, Courses, Study Notes */}
      <div className="finance-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Assignments Due</span>
            <div className="stat-icon stat-icon-amber">
              <Clock size={18} />
            </div>
          </div>
          <div className="stat-value">{pendingAssignments.length} Pending</div>
          <div className="stat-subtext" style={{ color: highPriorityPending > 0 ? 'var(--accent-rose, #fb7185)' : 'var(--text-muted)' }}>
            {highPriorityPending} High Priority deliverable{highPriorityPending === 1 ? '' : 's'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Completed Tasks</span>
            <div className="stat-icon stat-icon-green">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="stat-value">{completedAssignments.length} Completed</div>
          <div className="stat-subtext">
            {totalAssignments > 0 ? `${Math.round((completedAssignments.length / totalAssignments) * 100)}% completion rate` : 'No assignments'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Weekly Classes</span>
            <div className="stat-icon stat-icon-indigo">
              <Calendar size={18} />
            </div>
          </div>
          <div className="stat-value">{data.academic.schedules.length} Sessions</div>
          <div className="stat-subtext">
            Monday through Friday timetable
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Course Resources</span>
            <div className="stat-icon stat-icon-purple">
              <BookOpen size={18} />
            </div>
          </div>
          <div className="stat-value">{data.academic.resources.length} Items</div>
          <div className="stat-subtext" style={{ color: 'var(--accent-primary)' }}>
            Reference links & materials
          </div>
        </div>
      </div>

      {/* Subnav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div className="sub-nav-bar">
          <button
            className={`sub-nav-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            Schedule
          </button>
          <button
            className={`sub-nav-btn ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            Assignments
          </button>
          <button
            className={`sub-nav-btn ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            Course Resources
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {activeTab === 'schedule' && (
            <button className="btn-primary" onClick={() => setActiveModal('schedule-slot')}>
              <Plus size={16} />
              <span>Add Class</span>
            </button>
          )}
          {activeTab === 'assignments' && (
            <button className="btn-primary" onClick={() => setActiveModal('assignment')}>
              <Plus size={16} />
              <span>Add Assignment</span>
            </button>
          )}
          {activeTab === 'resources' && (
            <button className="btn-primary" onClick={() => setActiveModal('resource')}>
              <Plus size={16} />
              <span>Add Resource</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Editable Weekly Timetable */}
      {activeTab === 'schedule' && (
        <div className="glass-card">
          <div style={{ marginBottom: '18px' }}>
            <h3 className="section-title"> Class Schedule</h3>
          </div>

          <div className="timetable-grid">
            {daysOfWeek.map((day) => {
              const daySlots = data.academic.schedules
                .filter((s) => s.day === day)
                .sort(compareScheduleTimes);

              return (
                <div key={day} className="timetable-col">
                  <div className="timetable-day-header">{day}</div>

                  {daySlots.length === 0 ? (
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textAlign: 'center', margin: 'auto', padding: '20px 0' }}>
                      No classes scheduled
                    </div>
                  ) : (
                    daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="timetable-slot"
                        style={{ background: slot.color || '#6366f1' }}
                        onClick={() => setEditingSlot(slot)}
                        title="Click to edit class"
                      >
                        <div className="timetable-slot-actions">
                          <button
                            type="button"
                            className="slot-icon-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingSlot(slot);
                            }}
                            title="Edit class"
                          >
                            <Pencil size={11} />
                          </button>
                          <button
                            type="button"
                            className="slot-icon-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteScheduleSlot(slot.id);
                            }}
                            title="Delete class"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                        <span className="slot-code">{slot.courseCode}</span>
                        <span className="slot-time">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <span className="slot-room">{slot.room}</span>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Assignments with Kanban Board View */}
      {activeTab === 'assignments' && (
        <div>
          {/* Controls Bar */}
          <div
            className="glass-card"
            style={{
              padding: '12px 18px',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>View:</span>
                <div className="academic-view-toggle-wrap" style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', padding: '2px' }}>
                  <button
                    className={`sub-nav-btn ${assignmentViewMode === 'kanban' ? 'active' : ''}`}
                    style={{ padding: '5px 12px', fontSize: '12px', borderRadius: '6px' }}
                    onClick={() => setAssignmentViewMode('kanban')}
                  >
                    Kanban Board
                  </button>
                  <button
                    className={`sub-nav-btn ${assignmentViewMode === 'table' ? 'active' : ''}`}
                    style={{ padding: '5px 12px', fontSize: '12px', borderRadius: '6px' }}
                    onClick={() => setAssignmentViewMode('table')}
                  >
                    List Table
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>Priority:</span>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '5px 10px', fontSize: '12px' }}
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>
          </div>

          {/* Kanban Board View */}
          {assignmentViewMode === 'kanban' ? (
            <div className="kanban-board">
              {kanbanColumns.map((col) => (
                <div
                  key={col.id}
                  className={`kanban-column ${dragOverCol === col.id ? 'drag-over' : ''}`}
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col.id)}
                >
                  <div className="kanban-column-header">
                    <div className="kanban-col-title-wrap">
                      <div className="kanban-col-icon" style={{ background: col.iconBg }}>
                        {col.icon}
                      </div>
                      <span className="kanban-col-title">{col.title}</span>
                    </div>
                    <span className="kanban-col-count">{col.items.length}</span>
                  </div>

                  <div className="kanban-cards-list">
                    {col.items.length === 0 ? (
                      <div className="kanban-empty-col">
                        <span>No assignments in {col.title.toLowerCase()}</span>
                      </div>
                    ) : (
                      col.items.map((asg) => (
                        <div
                          key={asg.id}
                          className="kanban-card"
                          draggable
                          onDragStart={(e) => handleDragStart(e, asg.id)}
                        >
                          <div className="kanban-card-top">
                            <span className="course-code-badge">{asg.courseCode}</span>
                            <span
                              className={`due-badge ${asg.priority === 'high'
                                ? 'badge-urgent'
                                : asg.priority === 'medium'
                                  ? 'badge-soon'
                                  : 'badge-upcoming'
                                }`}
                            >
                              {asg.priority}
                            </span>
                          </div>

                          <div className="kanban-card-title">{asg.title}</div>

                          {asg.notes && (
                            <div className="kanban-card-notes">
                              {asg.notes}
                            </div>
                          )}

                          <div className="kanban-card-meta">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={12} />
                              <span>{asg.dueDate || 'No due date'}</span>
                            </div>
                            <button
                              type="button"
                              className="vault-btn-icon"
                              style={{ padding: '2px' }}
                              onClick={() => deleteAssignment(asg.id)}
                              title="Delete assignment"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {/* Quick Stage Controls */}
                          <div className="kanban-card-actions">
                            {col.id === 'pending' && (
                              <>
                                <button
                                  type="button"
                                  className="kanban-move-btn"
                                  onClick={() => updateAssignmentStatus(asg.id, 'in-progress')}
                                >
                                  <span>Start</span>
                                  <ArrowRight size={11} />
                                </button>
                                <button
                                  type="button"
                                  className="kanban-move-btn kanban-done-btn"
                                  onClick={() => updateAssignmentStatus(asg.id, 'completed')}
                                >
                                  <CheckCircle2 size={11} />
                                  <span>Done</span>
                                </button>
                              </>
                            )}

                            {col.id === 'in-progress' && (
                              <>
                                <button
                                  type="button"
                                  className="kanban-move-btn"
                                  onClick={() => updateAssignmentStatus(asg.id, 'pending')}
                                >
                                  <ArrowLeft size={11} />
                                  <span>To Do</span>
                                </button>
                                <button
                                  type="button"
                                  className="kanban-move-btn kanban-done-btn"
                                  onClick={() => updateAssignmentStatus(asg.id, 'completed')}
                                >
                                  <CheckCircle2 size={11} />
                                  <span>Done</span>
                                </button>
                              </>
                            )}

                            {col.id === 'completed' && (
                              <button
                                type="button"
                                className="kanban-move-btn"
                                onClick={() => updateAssignmentStatus(asg.id, 'pending')}
                              >
                                <ArrowLeft size={11} />
                                <span>Reopen</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="glass-card">
              <div className="custom-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Course</th>
                      <th>Deliverable Title</th>
                      <th>Notes</th>
                      <th>Due Date</th>
                      <th>Priority</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssignments.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                          No assignments recorded. Click "+ Add Assignment" to schedule tasks and deliverables.
                        </td>
                      </tr>
                    ) : (
                      filteredAssignments.map((asg) => (
                        <tr key={asg.id}>
                          <td>
                            <button
                              className={`due-badge ${asg.status === 'completed' ? 'badge-upcoming' : asg.status === 'in-progress' ? 'badge-soon' : 'badge-urgent'}`}
                              style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                              onClick={() => toggleAssignment(asg.id)}
                            >
                              {asg.status === 'completed' ? (
                                <>
                                  <CheckCircle size={12} />
                                  <span>Completed</span>
                                </>
                              ) : asg.status === 'in-progress' ? (
                                <span>In Progress</span>
                              ) : (
                                <span>To Do</span>
                              )}
                            </button>
                          </td>
                          <td style={{ whiteSpace: 'nowrap', width: '1%' }}>
                            <span className="course-code-badge">{asg.courseCode}</span>
                          </td>
                          <td style={{ fontWeight: 600 }}>{asg.title}</td>
                          <td style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '240px' }}>
                            {asg.notes || '—'}
                          </td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px' }}>{asg.dueDate}</td>
                          <td>
                            <span
                              className={`due-badge ${asg.priority === 'high'
                                ? 'badge-urgent'
                                : asg.priority === 'medium'
                                  ? 'badge-soon'
                                  : 'badge-upcoming'
                                }`}
                            >
                              {asg.priority}
                            </span>
                          </td>
                          <td>
                            <button
                              className="vault-btn-icon"
                              onClick={() => deleteAssignment(asg.id)}
                              title="Delete assignment"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Course Resources & Links */}
      {activeTab === 'resources' && (
        <div className="glass-card">
          <div style={{ marginBottom: '18px' }}>
            <h3 className="section-title">Course Resources</h3>
          </div>

          <div className="custom-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Resource Title</th>
                  <th style={{ whiteSpace: 'nowrap', width: '1%' }}>Course</th>
                  <th>Format</th>
                  <th>Notes</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No resources found. Click "+ Add Resource" to attach your first link!
                    </td>
                  </tr>
                ) : (
                  filteredResources.map((res) => (
                    <tr key={res.id}>
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '15px' }}>🔗</span>
                          {res.url ? (
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: 'var(--text-main)', textDecoration: 'none' }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
                              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
                            >
                              {res.title}
                            </a>
                          ) : (
                            <span>{res.title}</span>
                          )}
                        </div>
                      </td>
                      <td style={{ whiteSpace: 'nowrap', width: '1%' }}>
                        <span className="course-code-badge">{res.courseCode}</span>
                      </td>
                      <td>
                        <span
                          className="task-pill-badge"
                          style={{
                            background: 'rgba(99, 102, 241, 0.1)',
                            color: '#4f46e5',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            fontSize: '11px'
                          }}
                        >
                          {res.type || 'Link'}
                        </span>
                      </td>
                      <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                        {res.notes || '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          {res.url && (
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-secondary"
                              style={{ padding: '5px 12px', fontSize: '11.5px', gap: '5px' }}
                            >
                              <ExternalLink size={12} />
                              <span>Link</span>
                            </a>
                          )}
                          <button
                            type="button"
                            className="vault-btn-icon"
                            onClick={() => deleteAcademicResource(res.id)}
                            title="Delete resource"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingSlot && (
        <div className="modal-overlay" onClick={() => setEditingSlot(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Class Schedule</h3>
              <button className="modal-close-btn" onClick={() => setEditingSlot(null)}>
                <X size={18} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateScheduleSlot(editingSlot.id, editingSlot);
                setEditingSlot(null);
              }}
            >
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Day of Week</label>
                  <select
                    className="form-select"
                    value={editingSlot.day}
                    onChange={(e) => setEditingSlot({ ...editingSlot, day: e.target.value })}
                  >
                    <option value="Mon">Monday</option>
                    <option value="Tue">Tuesday</option>
                    <option value="Wed">Wednesday</option>
                    <option value="Thu">Thursday</option>
                    <option value="Fri">Friday</option>
                    <option value="Sat">Saturday</option>
                    <option value="Sun">Sunday</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Course / Class Code</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingSlot.courseCode}
                    onChange={(e) => setEditingSlot({ ...editingSlot, courseCode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <TimePicker
                    label="Start Time"
                    value={editingSlot.startTime}
                    onChange={(val) => setEditingSlot({ ...editingSlot, startTime: val })}
                  />
                </div>
                <div className="form-group">
                  <TimePicker
                    label="End Time"
                    value={editingSlot.endTime}
                    onChange={(val) => setEditingSlot({ ...editingSlot, endTime: val })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Room / Building</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingSlot.room}
                  onChange={(e) => setEditingSlot({ ...editingSlot, room: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Card Accent Color</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {['#6366f1', '#8b5cf6', '#10b981', '#0284c7', '#ec4899', '#f59e0b', '#f43f5e'].map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setEditingSlot({ ...editingSlot, color: hex })}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: hex,
                        border: editingSlot.color === hex ? '3px solid white' : '2px solid transparent',
                        boxShadow: editingSlot.color === hex ? '0 0 0 2px var(--accent-primary)' : 'none',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  onClick={() => {
                    deleteScheduleSlot(editingSlot.id);
                    setEditingSlot(null);
                  }}
                >
                  <Trash2 size={14} />
                  <span>Delete Class</span>
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setEditingSlot(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
