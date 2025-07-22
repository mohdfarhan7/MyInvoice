'use client';
import { useState, useRef } from 'react';

const defaultUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  contact: '+91 9876543210',
  photo: '',
};

type User = typeof defaultUser;

export default function ProfilePage() {
  const [user, setUser] = useState<User>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('profile');
      return saved ? JSON.parse(saved) : defaultUser;
    }
    return defaultUser;
  });
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<User>(user);
  const [photoPreview, setPhotoPreview] = useState<string>(user.photo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, files } = e.target;
    if (name === 'photo' && files && files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setPhotoPreview(dataUrl);
        setForm((f) => ({ ...f, photo: dataUrl }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  function handleEdit() {
    setForm(user);
    setPhotoPreview(user.photo);
    setEdit(true);
  }

  function handleCancel() {
    setForm(user);
    setPhotoPreview(user.photo);
    setEdit(false);
  }

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const updated = { ...form, photo: photoPreview };
    setUser(updated);
    localStorage.setItem('profile', JSON.stringify(updated));
    setEdit(false);
  }

  // Use placeholder if no photo is set
  const displayPhoto = photoPreview || '/placeholder-user.jpg';

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={displayPhoto}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border"
            />
            {edit && (
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-gray-200 rounded-full p-1"
                onClick={() => fileInputRef.current?.click()}
                title="Change photo"
              >
                <span role="img" aria-label="edit">✏️</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              name="photo"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
          </div>
          <div>
            <div className="font-semibold text-lg">{user.name}</div>
            <div className="text-gray-500 text-sm">{user.email}</div>
            <div className="text-gray-500 text-sm">{user.contact}</div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!edit}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={!edit}
              className="w-full border p-2 rounded mt-1"
              type="email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Contact Number</label>
            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              disabled={!edit}
              className="w-full border p-2 rounded mt-1"
              required
            />
          </div>
        </div>
        <div className="flex gap-2">
          {edit ? (
            <>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              <button type="button" onClick={handleCancel} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
            </>
          ) : (
            <button type="button" onClick={handleEdit} className="bg-blue-600 text-white px-4 py-2 rounded">Edit</button>
          )}
        </div>
      </form>
    </div>
  );
} 