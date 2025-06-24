import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-6">
        <p className="text-center text-sm text-muted-foreground">
          © 2025, made with love by{' '}
          <Link
            href="https://iamtiksha.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            I am Tiksha
          </Link>{' '}
          &amp;{' '}
          <Link
            href="https://nicsync.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            NicSync
          </Link>{' '}
          for a better web.
        </p>
      </div>
    </footer>
  );
}
