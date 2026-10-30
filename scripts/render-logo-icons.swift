import AppKit
import Foundation

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let source = root.appendingPathComponent("output/imagegen/brand-mosque-20261016/mosque-refined.png")
guard let image = NSImage(contentsOf: source) else {
  fatalError("Ausgewähltes Moschee-Original konnte nicht geladen werden")
}

for (size, path, scale) in [
  (180, "public/premium-assets/high-res-objects/nur-logo-emblem.png", 1.0),
  (192, "public/nur-app-icon-192.png", 1.0),
  (512, "public/nur-app-icon-512.png", 1.0),
  (512, "public/nur-app-icon-maskable-512.png", 0.8),
] {
  guard let bitmap = NSBitmapImageRep(
    bitmapDataPlanes: nil,
    pixelsWide: size,
    pixelsHigh: size,
    bitsPerSample: 8,
    samplesPerPixel: 4,
    hasAlpha: true,
    isPlanar: false,
    colorSpaceName: .deviceRGB,
    bytesPerRow: 0,
    bitsPerPixel: 0
  ), let context = NSGraphicsContext(bitmapImageRep: bitmap) else {
    fatalError("Bitmap für \(size) px konnte nicht angelegt werden")
  }

  NSGraphicsContext.saveGraphicsState()
  NSGraphicsContext.current = context
  context.imageInterpolation = .high
  NSColor(srgbRed: 0, green: 57.0 / 255.0, blue: 39.0 / 255.0, alpha: 1).setFill()
  NSRect(x: 0, y: 0, width: size, height: size).fill()
  let inset = Double(size) * (1 - scale) / 2
  image.draw(in: NSRect(x: inset, y: inset, width: Double(size) * scale, height: Double(size) * scale))
  context.flushGraphics()
  NSGraphicsContext.restoreGraphicsState()

  guard let data = bitmap.representation(using: .png, properties: [:]) else {
    fatalError("PNG für \(size) px konnte nicht erzeugt werden")
  }
  try data.write(to: root.appendingPathComponent(path), options: .atomic)
  print("\(path): \(size) × \(size)")
}
