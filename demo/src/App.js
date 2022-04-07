import React from 'react'
import DemoForm1 from './demo-form-1'

function App() {
  return (
    <div className="col-lg-8 mx-auto p-3 py-md-5">
      <header className="d-flex align-items-center pb-3 mb-5 border-bottom">
        <a href="/" className="d-flex align-items-center text-dark text-decoration-none">
          <span className="fs-4">@iwsio/forms</span>
        </a>
      </header>

      <main>
        <h1>Forms Demo</h1>
        <p className="fs-5 col-md-8">...</p>
        <DemoForm1 />
      </main>
      <footer className="pt-5 my-5 text-muted border-top">
        Created by the Integrated Web Systems, LLC &middot; &copy; 2022
      </footer>
    </div>
  );
}

export default App;
