import { useState } from 'react';
import './CommentForm.css';

const CommentForm = ({ mode, initialData, onSubmit, onCancel, loading }) => {
  // Start with the post's values when editing, or empty fields when creating
  const [formData, setFormData] = useState({
    body: initialData?.body || '',
  });
  const [errors, setErrors] = useState({});

  const { body } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!body.trim()) {
      newErrors.body = 'Body is required';
    } else if (body.trim().length > 500) {
      newErrors.body = 'Body must be at most 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(title.trim(), body.trim());
  };

  return (
    <div className="post-form">
      <h2>{mode === 'create' ? 'Create New Post' : 'Edit Post'}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="body">Body</label>
          <textarea
            id="body"
            name="body"
            value={body}
            onChange={onChange}
            placeholder="Write your post content here..."
            rows="12"
            className={errors.body ? 'input-error' : ''}
            disabled={loading}
          />
          {errors.body && <span className="field-error">{errors.body}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading
              ? mode === 'create'
                ? 'Creating...'
                : 'Saving...'
              : mode === 'create'
              ? 'Create Post'
              : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;