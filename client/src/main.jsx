import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const STATUSES = ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'];

function App() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [form, setForm] = useState({
    name: '',
    description: '',
    targetX: '120.5',
    targetY: '80.0',
  });

  const runningCount = useMemo(
    () => jobs.filter((job) => job.status === 'RUNNING').length,
    [jobs],
  );

  useEffect(() => {
    loadJobs();
  }, []);

  async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });

    if (!response.ok) {
      let message = `Request failed with status ${response.status}`;
      try {
        const body = await response.json();
        message = body.message ?? message;
      } catch {
        // Keep the generic HTTP error when the response has no JSON body.
      }
      throw new Error(message);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  async function loadJobs(nextStatusFilter = statusFilter) {
    setIsLoading(true);
    setError('');
    try {
      const path =
        nextStatusFilter === 'ALL'
          ? '/api/jobs'
          : `/api/jobs/status/${nextStatusFilter}`;
      setJobs(await request(path));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function createJob(event) {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      await request('/api/jobs', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          targetX: Number(form.targetX),
          targetY: Number(form.targetY),
        }),
      });
      setForm({ name: '', description: '', targetX: '120.5', targetY: '80.0' });
      await loadJobs();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function updateStatus(id, status) {
    setError('');
    try {
      const updated = await request(`/api/jobs/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setJobs((currentJobs) => {
        if (statusFilter !== 'ALL' && updated.status !== statusFilter) {
          return currentJobs.filter((job) => job.id !== id);
        }

        return currentJobs.map((job) => (job.id === id ? updated : job));
      });
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function deleteJob(id) {
    setError('');
    try {
      await request(`/api/jobs/${id}`, { method: 'DELETE' });
      setJobs((currentJobs) => currentJobs.filter((job) => job.id !== id));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main className="app-shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">Spring Boot + PostgreSQL + AWS practice</p>
          <h1>Robot Job Tracker</h1>
        </div>
        <button className="secondary-button" onClick={() => loadJobs()} disabled={isLoading}>
          Refresh
        </button>
      </section>

      <section className="metrics-grid" aria-label="Job metrics">
        <Metric label="Total jobs" value={jobs.length} />
        <Metric label="Running" value={runningCount} />
        <Metric label="API" value={API_BASE_URL.replace(/^https?:\/\//, '')} compact />
      </section>

      {error ? <div className="error-banner">{error}</div> : null}

      <section className="workspace">
        <form className="job-form" onSubmit={createJob}>
          <h2>Create job</h2>
          <label>
            Name
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Pick object A"
              maxLength={120}
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Move part from input tray to inspection station"
              maxLength={500}
              rows={4}
            />
          </label>
          <div className="coordinate-row">
            <label>
              Target X
              <input
                value={form.targetX}
                onChange={(event) => setForm({ ...form, targetX: event.target.value })}
                type="number"
                step="0.1"
                required
              />
            </label>
            <label>
              Target Y
              <input
                value={form.targetY}
                onChange={(event) => setForm({ ...form, targetY: event.target.value })}
                type="number"
                step="0.1"
                required
              />
            </label>
          </div>
          <button className="primary-button" disabled={isSaving}>
            {isSaving ? 'Creating...' : 'Create job'}
          </button>
        </form>

        <section className="job-table-section">
          <div className="section-heading">
            <div>
              <h2>Jobs</h2>
              <span>{isLoading ? 'Loading' : `${jobs.length} records`}</span>
            </div>
            <label className="filter-control">
              Status
              <select
                value={statusFilter}
                onChange={(event) => {
                  const nextStatusFilter = event.target.value;
                  setStatusFilter(nextStatusFilter);
                  loadJobs(nextStatusFilter);
                }}
              >
                <option value="ALL">ALL</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Target</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>#{job.id}</td>
                    <td>
                      <strong>{job.name}</strong>
                      {job.description ? <small>{job.description}</small> : null}
                    </td>
                    <td>
                      {job.targetX}, {job.targetY}
                    </td>
                    <td>
                      <select
                        className={`status-select status-${job.status.toLowerCase()}`}
                        value={job.status}
                        onChange={(event) => updateStatus(job.id, event.target.value)}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{new Date(job.createdAt).toLocaleString()}</td>
                    <td>
                      <button className="danger-button" onClick={() => deleteJob(job.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!isLoading && jobs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No robot jobs yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value, compact = false }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong className={compact ? 'compact-value' : ''}>{value}</strong>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
