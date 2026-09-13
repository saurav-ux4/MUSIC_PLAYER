import GoogleLoginButton from "./GoogleLoginButton";
import Profile from "./Profile";

function AccountPanel({ open, onClose }) {
  return (
    <div className={`overlay-sheet ${open ? "open" : ""}`}>
      <div className="song-list-header">
        <button className="icon-button ghost small" onClick={onClose} aria-label="Close">
          <ChevronLeftIcon />
        </button>
        <h1>Account</h1>
        <span className="header-spacer" />
      </div>

      <div className="account-panel-body">
        <Profile />
        <GoogleLoginButton />
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export default AccountPanel;