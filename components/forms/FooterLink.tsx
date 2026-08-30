import Link from "next/link";

const FooterLink = ({ text, linkText, href }: FooterLinkProps) => {
  return (
    <p className="pt-2 text-center font-text text-[0.9375rem] text-ink-2">
      {text}{" "}
      <Link
        href={href}
        className="text-caution underline underline-offset-4 transition-opacity hover:opacity-70 focus:outline-none focus-visible:outline-1 focus-visible:outline-caution"
      >
        {linkText}
      </Link>
    </p>
  );
};

export default FooterLink;
