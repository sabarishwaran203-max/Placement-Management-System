import React from 'react';

export default function About() {
  return (
    <div>
      <div className="page-header"><h2>About This System</h2></div>
      <div className="card">
        <h3>Placement Management System</h3>
        <p>
          A full-stack CRUD-based web application built for managing college placement
          activities — students, companies, placement applications, and final placement records.
        </p>
        <h4>Technology Stack</h4>
        <ul className="about-list">
          <li><strong>Frontend:</strong> React, React Router, Axios, HTML, CSS</li>
          <li><strong>Backend:</strong> Python, Django, Django REST Framework</li>
          <li><strong>Database:</strong> MySQL (via Django ORM)</li>
          <li><strong>API Testing:</strong> Postman</li>
        </ul>
        <h4>Architecture</h4>
        <p>User → React Frontend → Axios → Django REST API → Django ORM → MySQL Database</p>
        <h4>Academic Project</h4>
        <p>Built as an academic mini/major project demonstrating complete CRUD operations,
          REST API design, authentication, validation, search & filtering, and a responsive UI.</p>
      </div>
    </div>
  );
}
