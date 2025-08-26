import './form.scss';
import React, { useState } from 'react';

function Form(props) {
  // Keep track of which method the user selects (default = GET)
  const [method, setMethod] = useState('GET');

  // Store the URL typed by the user
  const [url, setUrl] = useState('');

  // Store the body text (only for POST/PUT requests)
  const [body, setBody] = useState('');

  // Runs when the form is submitted
  const handleSubmit = e => {
    e.preventDefault(); // stop page reload
    const formData = {
      method, // GET, POST, PUT, DELETE
      url,    // user’s input URL
      body: method === 'POST' || method === 'PUT' ? body : null, // include body only if needed
    };
    props.handleApiCall(formData); // send data up to App.js
  };

  return (
    <>
      {/* Form wrapper that runs handleSubmit when user clicks GO */}
      <form onSubmit={handleSubmit}>
        <label>
          <span>URL: </span>
          {/* Input where user types the API URL */}
          <input
            name="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)} // update state as user types
          />
          <button type="submit">GO!</button>
        </label>

        {/* Clickable method buttons (GET, POST, PUT, DELETE) */}
        <label className="methods">
          <span
            id="get"
            className={method === 'GET' ? 'active' : ''} // highlight if active
            onClick={() => setMethod('GET')} // change method on click
          >
            GET
          </span>
          <span
            id="post"
            className={method === 'POST' ? 'active' : ''}
            onClick={() => setMethod('POST')}
          >
            POST
          </span>
          <span
            id="put"
            className={method === 'PUT' ? 'active' : ''}
            onClick={() => setMethod('PUT')}
          >
            PUT
          </span>
          <span
            id="delete"
            className={method === 'DELETE' ? 'active' : ''}
            onClick={() => setMethod('DELETE')}
          >
            DELETE
          </span>
        </label>

        {/* Only show body text area for POST/PUT */}
        {(method === 'POST' || method === 'PUT') && (
          <label>
            <span>Body:</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)} // update body as user types
            />
          </label>
        )}
      </form>
    </>
  );
}

export default Form;
