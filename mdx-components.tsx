import type { MDXComponents } from "mdx/types";
import { FAQBlock } from "@/components/blog/FAQBlock";
import { BlogCTA } from "@/components/blog/BlogCTA";

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-[28px] md:text-[36px] font-bold tracking-[-0.03em] text-navy leading-[1.3] mt-12 mb-4 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => {
    const id =
      typeof children === "string"
        ? children
            .toLowerCase()
            .replace(/[^가-힣a-z0-9\s]/g, "")
            .replace(/\s+/g, "-")
        : undefined;
    return (
      <h2
        id={id}
        className="text-[22px] md:text-[26px] font-bold tracking-[-0.02em] text-navy leading-[1.35] mt-12 mb-4 scroll-mt-24"
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({ children }) => (
    <h3 className="text-[18px] md:text-[20px] font-semibold text-navy leading-[1.4] mt-8 mb-3">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-[16px] leading-[1.8] text-text-secondary mb-5">
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-coral hover:text-coral-hover underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="text-[16px] leading-[1.8] text-text-secondary mb-5 pl-6 list-disc marker:text-coral/60">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="text-[16px] leading-[1.8] text-text-secondary mb-5 pl-6 list-decimal marker:text-coral/60">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="mb-1.5 pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-[3px] border-coral/40 bg-coral-light/50 rounded-r-lg pl-5 pr-4 py-4 my-6 text-[15px] leading-[1.7] text-text-secondary [&>p]:mb-0">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-navy">{children}</strong>
  ),
  hr: () => <hr className="border-border-light my-10" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-[14px] border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="text-left font-semibold text-navy bg-bg-warm px-4 py-2.5 border-b border-border-light">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="text-text-secondary px-4 py-2.5 border-b border-border-light/60">
      {children}
    </td>
  ),
  FAQBlock,
  BlogCTA,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
