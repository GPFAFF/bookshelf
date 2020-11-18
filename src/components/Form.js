import React, { useState } from 'react'

export const Form = () => {
  const initialState = {
    email: '',
    password: '',
  };

  const [formData, setFormData] = useState(initialState);
  const { email, password } = formData;

  function handleSubmit(event) {
    event.preventDefault();
    console.log(formData);
  };

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" name="email" value={email} onChange={handleChange} />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input id="password" type="text" name="password" value={password} onChange={handleChange} />
      </p>
      <button type="submit">Submit</button>
    </form>

  )
}
