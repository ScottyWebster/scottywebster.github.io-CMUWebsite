import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!emailPattern.test(formData.email.trim()))
      newErrors.email = "Enter a valid email.";
    if (!formData.message.trim())
      newErrors.message = "Message cannot be empty.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } else {
      setSuccess(false);
    }
  };

  return (
    <section>
      <h2>Contact Me</h2>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <div className="form-row">
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && (
            <span className="error" style={{ color: "red" }}>
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-row">
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {errors.email && (
            <span className="error" style={{ color: "red" }}>
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-row align-top">
          <label>Message:</label>
          <textarea
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
          />
          {errors.message && (
            <span className="error" style={{ color: "red" }}>
              {errors.message}
            </span>
          )}
        </div>

        <button type="submit" style={{ marginTop: "15px" }}>
          Send
        </button>
        {success && (
          <p className="success" style={{ color: "green", marginTop: "15px" }}>
            Message would be sent successfully if I had a mail server!
          </p>
        )}
      </form>
    </section>
  );
}
