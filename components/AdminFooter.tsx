const AdminFooter = () => {
  return (
    <footer className="bg-[var(--sidebar)] text-[var(--sidebar-foreground)] text-center py-4 border-t border-[var(--sidebar-border)] transition-colors">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
      </p>
    </footer>
  );
};

export default AdminFooter;
