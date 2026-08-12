import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-text-primary">
              Karigar<span className="text-primary">.pk</span>
            </span>
          </Link>

          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <Link to="/workers" className="hover:text-primary transition-colors">Find Workers</Link>
            <Link to="/signup" className="hover:text-primary transition-colors">Sign Up</Link>
            <Link to="/login" className="hover:text-primary transition-colors">Log In</Link>
          </div>

          <p className="text-sm text-text-secondary">
            &copy; {new Date().getFullYear()} Karigar.pk
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
