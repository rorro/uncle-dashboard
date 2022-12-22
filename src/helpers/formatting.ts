import { emojis } from './emojis';

function markup(
  text: string,
  options: {
    replaceEmojis?: boolean;
    inlineBlock?: boolean;
    inEmbed?: boolean;
  }
) {
  const { replaceEmojis, inlineBlock, inEmbed } = options;

  let out = '';
  if (replaceEmojis)
    out = text.replace(/(?<!code(?: \w+=".+")?>[^>]+)(?<!\/[^\s"]+?):((?!\/)\w+):/g, (match, p) =>
      p && emojis[p] ? emojis[p] : match
    );

  out = out
    /** Markdown */
    .replace(
      /<:\w+:(\d{17,19})>/g,
      '<img class="emoji" src="https://cdn.discordapp.com/emojis/$1.png"/>'
    )
    .replace(
      /<a:\w+:(\d{17,20})>/g,
      '<img class="emoji" src="https://cdn.discordapp.com/emojis/$1.gif"/>'
    )
    .replace(/~~(.+?)~~/g, '<s>$1</s>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<em><strong>$1</strong></em>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<u>$1</u>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Replace >>> and > with block-quotes. &#62; is HTML code for >
    .replace(
      /^(?: *&#62;&#62;&#62; ([\s\S]*))|(?:^ *&#62;(?!&#62;&#62;) +.+\n)+(?:^ *&#62;(?!&#62;&#62;) .+\n?)+|^(?: *&#62;(?!&#62;&#62;) ([^\n]*))(\n?)/gm,
      (all, match1, match2, newLine) => {
        return `<div class="blockquote"><div class="blockquoteDivider"></div><blockquote>${
          match1 || match2 || newLine ? match1 || match2 : all.replace(/^ *&#62; /gm, '')
        }</blockquote></div>`;
      }
    )

    /** Mentions */
    .replace(/&#60;#\d+&#62;/g, () => `<span class="mention channel interactive">channel</span>`)
    .replace(/&#60;@(?:&#38;|!)?\d+&#62;|@(?:everyone|here)/g, match => {
      if (match.startsWith('@')) return `<span class="mention">${match}</span>`;
      else
        return `<span class="mention interactive">@${match.includes('&#38;') ? 'role' : 'user'}</span>`;
    });

  if (inlineBlock)
    // Treat both inline code and code blocks as inline code
    out = out.replace(/`([^`]+?)`|``([^`]+?)``|```((?:\n|.)+?)```/g, (m, x, y, z) =>
      x
        ? `<code class="inline">${x}</code>`
        : y
        ? `<code class="inline">${y}</code>`
        : z
        ? `<code class="inline">${z}</code>`
        : m
    );
  else {
    // Code block
    out = out.replace(/```(?:([a-z0-9_+\-.]+?)\n)?\n*([^\n][^]*?)\n*```/gi, (m, w, x) => {
      if (w) return `<pre><code class="${w}">${x.trim()}</code></pre>`;
      else return `<pre><code class="hljs nohighlight">${x.trim()}</code></pre>`;
    });
    // Inline code
    out = out.replace(/`([^`]+?)`|``([^`]+?)``/g, (m, x, y, z) =>
      x
        ? `<code class="inline">${x}</code>`
        : y
        ? `<code class="inline">${y}</code>`
        : z
        ? `<code class="inline">${z}</code>`
        : m
    );
  }

  if (inEmbed)
    out = out.replace(
      /\[([^\[\]]+)\]\((.+?)\)/g,
      `<a title="$1" target="_blank" class="anchor" href="$2">$1</a>`
    );

  return out;
}

export { markup };
