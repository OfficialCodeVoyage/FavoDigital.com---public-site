import { Fragment } from "react";

/**
 * Renders brand copy in which `⬡` marks the amber honeycomb-hex glyph (the same
 * vector as the wordmark 'o' and the favicon). The visual run is aria-hidden and
 * a plain-text reading is exposed to screen readers, so "Fav⬡Digital" is seen as
 * a hex but read as "FavoDigital".
 *
 * @param text  Copy containing one or more `⬡` placeholders.
 * @param hexClassName  CSS-module class that styles the hex span at the right scale.
 * @param plain  Accessible reading. Defaults to `text` with the `⬡` removed —
 *               correct for "favo⬡r." → "favor." but override where it isn't
 *               (e.g. the wordmark, where `⬡` stands in for the letter 'o').
 */
export function HexText({
  text,
  hexClassName,
  plain,
}: {
  text: string;
  hexClassName: string;
  plain?: string;
}) {
  const parts = text.split("⬡");
  return (
    <>
      <span aria-hidden="true">
        {parts.map((part, i) => (
          <Fragment key={i}>
            {part}
            {i < parts.length - 1 && <span className={hexClassName} />}
          </Fragment>
        ))}
      </span>
      <span className="sr-only">{plain ?? text.replace(/⬡/g, "")}</span>
    </>
  );
}
