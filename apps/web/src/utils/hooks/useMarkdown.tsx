import { useEffect, useState } from "react";
import matter from "front-matter";
import ReactMarkdown from "react-markdown";
import { Code, TypographyStylesProvider } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

export const useMarkdown = <T = any,>(documentPath: string) => {
    const [content, setContent] = useState("");
    const [metadata, setMetadata] = useState<T>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(documentPath)
            .then((res) => res.text())
            .then((doc) => {
                const { body, attributes } = matter<T>(doc);
                setContent(body);
                setMetadata(attributes);
            })
            .catch((err) => {
                throw new Error(JSON.stringify(err));
            })
            .finally(() => setLoading(false));
    }, [documentPath]);

    const renderer = () => (
        <TypographyStylesProvider>
            <ReactMarkdown
                rehypePlugins={[
                    rehypeSlug,
                    [
                        rehypeAutolinkHeadings,
                        {
                            behavior: "append",
                            properties: {
                                className: ["anchor-link"],
                                tabIndex: -1,
                            },
                            content: {
                                type: "element",
                                tagName: "span",
                                properties: {
                                    className: ["custom-anchor-icon"],
                                },
                                children: [{ type: "text", value: "  #" }],
                            },
                        },
                    ],
                ]}
                components={{
                    code: ({ className, children, node, ...props }) => {
                        const isInline =
                            node?.position?.start.line ===
                            node?.position?.end.line;

                        const lang = className?.replace("language-", "") ?? "";

                        if (isInline) return <Code {...props}>{children}</Code>;

                        return (
                            <CodeHighlight
                                code={String(children).trim()}
                                language={lang}
                            />
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </TypographyStylesProvider>
    );

    return {
        renderer,
        metadata,
        loading,
    };
};
