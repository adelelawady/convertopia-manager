const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-blue max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-600">
            Convertopia Manager ("we", "our", or "us") is committed to protecting your privacy. 
            This Privacy Policy explains how we handle your data when you use our file conversion services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Data Processing</h2>
          <p className="text-gray-600">
            All file conversions are performed locally in your browser. We do not upload your files 
            to any servers, and we do not store any of your files or personal information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Collection</h2>
          <p className="text-gray-600">
            We do not collect any personal information or track your usage of the application. 
            The application runs entirely in your browser, ensuring your privacy and data security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Contact</h2>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, please contact us through our GitHub repository.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 