const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      
      <div className="prose prose-blue max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600">
            By accessing and using Convertopia Manager, you accept and agree to be bound by the terms 
            and provisions of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
          <p className="text-gray-600">
            This application is provided under the MIT License. You are free to use, modify, and 
            distribute the application in accordance with the license terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Limitations</h2>
          <p className="text-gray-600">
            The application is provided "as is" without warranties of any kind. We are not responsible 
            for any data loss or damages that may occur during file conversion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Changes to Terms</h2>
          <p className="text-gray-600">
            We reserve the right to modify these terms at any time. Please review these terms periodically 
            for changes.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService; 