import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 text-center px-4">
      {/* Browser-like window */}
      <div className="mockup-browser border bg-base-200 w-full max-w-xl mb-8">
        <div className="mockup-browser-toolbar">
          <div className="input border border-base-300">https://yourtextpad.vercel.app/404</div>
        </div>
        <div className="flex flex-col items-center justify-center px-4 py-12">
          <h1 className="text-6xl font-bold text-error mb-4">404</h1>
          <p className="text-xl text-base-content mb-6">
            Oops! The page you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="btn btn-primary"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
