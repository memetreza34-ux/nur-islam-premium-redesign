import Foundation
import CoreText
import CoreGraphics

let directory = CommandLine.arguments[1]
let word = "الله"
let font = CTFontCreateWithName("GeezaPro-Bold" as CFString, 220, nil)
let attributes: [NSAttributedString.Key: Any] = [.init(kCTFontAttributeName as String): font]
let line = CTLineCreateWithAttributedString(NSAttributedString(string: word, attributes: attributes))
let outline = CGMutablePath()
for run in CTLineGetGlyphRuns(line) as! [CTRun] {
    let count = CTRunGetGlyphCount(run)
    var glyphs = [CGGlyph](repeating: 0, count: count)
    var positions = [CGPoint](repeating: .zero, count: count)
    CTRunGetGlyphs(run, CFRange(location: 0, length: 0), &glyphs)
    CTRunGetPositions(run, CFRange(location: 0, length: 0), &positions)
    let runFont = (CTRunGetAttributes(run) as NSDictionary)[kCTFontAttributeName] as! CTFont
    for i in 0..<count {
        if let path = CTFontCreatePathForGlyph(runFont, glyphs[i], nil) {
            outline.addPath(path, transform: CGAffineTransform(translationX: positions[i].x, y: positions[i].y))
        }
    }
}
let bounds = outline.boundingBoxOfPath
let scale = min(340 / bounds.width, 228 / bounds.height)
var transform = CGAffineTransform(a: scale, b: 0, c: 0, d: -scale, tx: 512 - bounds.midX * scale, ty: 540 + bounds.midY * scale)
let finalPath = outline.copy(using: &transform)!
func number(_ value: CGFloat) -> String { String(format: "%.3f", Double(value)) }
func point(_ value: CGPoint) -> String { "\(number(value.x)) \(number(value.y))" }
var commands = [String]()
finalPath.applyWithBlock { pointer in
    let element = pointer.pointee
    switch element.type {
    case .moveToPoint: commands.append("M" + point(element.points[0]))
    case .addLineToPoint: commands.append("L" + point(element.points[0]))
    case .addQuadCurveToPoint: commands.append("Q" + point(element.points[0]) + " " + point(element.points[1]))
    case .addCurveToPoint: commands.append("C" + point(element.points[0]) + " " + point(element.points[1]) + " " + point(element.points[2]))
    case .closeSubpath: commands.append("Z")
    @unknown default: break
    }
}
let glyphPath = commands.joined(separator: " ")
let svg = """
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024" role="img" aria-labelledby="title desc">
<title id="title">App-Icon – Spitzbogen mit الله</title>
<desc id="desc">Breiter Spitzbogen wie in der App, mit dem arabischen Wort Allah auf smaragdgrünem Grund.</desc>
<defs>
<radialGradient id="background" cx=".3" cy=".1" r="1.1"><stop stop-color="#215444"/><stop offset="1" stop-color="#05281f"/></radialGradient>
<linearGradient id="inset" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#124535"/><stop offset="1" stop-color="#082e25"/></linearGradient>
<linearGradient id="gold" x1="0" y1="1" x2=".8" y2="0"><stop stop-color="#a17a37"/><stop offset=".5" stop-color="#e4c582"/><stop offset="1" stop-color="#f5dfaa"/></linearGradient>
<linearGradient id="letter" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff5df"/><stop offset="1" stop-color="#ead5a9"/></linearGradient>
</defs>
<rect width="1024" height="1024" fill="url(#background)"/>
<g transform="translate(143.275 274) scale(2.15)">
<path d="M1.5 210 L1.5 92 C1.5 39 65 26 171.5 1.5 C278 26 341.5 39 341.5 92 L341.5 210 Z" fill="url(#inset)"/>
<path d="M1.5 210 L1.5 92 C1.5 39 65 26 171.5 1.5 C278 26 341.5 39 341.5 92 L341.5 210" fill="none" stroke="#031f18" stroke-width="10" stroke-linecap="round" transform="translate(0 2)"/>
<path d="M1.5 210 L1.5 92 C1.5 39 65 26 171.5 1.5 C278 26 341.5 39 341.5 92 L341.5 210" fill="none" stroke="url(#gold)" stroke-width="7" stroke-linecap="round"/>
</g>
<path d="\(glyphPath)" fill="url(#letter)"/>
</svg>
"""
try svg.write(toFile: directory + "/app-icon.svg", atomically: true, encoding: .utf8)
let metadata: [String: Any] = ["word": word, "font": CTFontCopyPostScriptName(font) as String, "sourceArch": "src/shared/MihrabArch.tsx · ARCH_OUTLINE", "method": "CoreText Arabic shaping, converted to SVG paths; no font required by exported SVG", "shapeWidth": bounds.width, "shapeHeight": bounds.height]
let data = try JSONSerialization.data(withJSONObject: metadata, options: [.prettyPrinted, .sortedKeys])
try data.write(to: URL(fileURLWithPath: directory + "/lettering.json"))
print("Created SVG with shaped Arabic outlines: \(word)")
