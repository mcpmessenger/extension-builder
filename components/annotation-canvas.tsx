"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { MousePointer, Square, ArrowRight, Type, Highlighter, Undo, Trash2 } from "lucide-react"

interface Annotation {
  id: string
  type: "arrow" | "box" | "text" | "highlight"
  x: number
  y: number
  width?: number
  height?: number
  endX?: number
  endY?: number
  text?: string
  color: string
}

interface AnnotationCanvasProps {
  screenshot: string
  annotations: Annotation[]
  onAnnotationsChange: (annotations: Annotation[]) => void
}

export function AnnotationCanvas({ screenshot, annotations, onAnnotationsChange }: AnnotationCanvasProps) {
  const [tool, setTool] = useState<"select" | "arrow" | "box" | "text" | "highlight">("select")
  const [color, setColor] = useState("#ef4444")
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    drawCanvas()
  }, [screenshot, annotations, currentAnnotation])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw screenshot
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // Draw all annotations
      ;[...annotations, currentAnnotation].filter(Boolean).forEach((annotation) => {
        if (!annotation) return
        drawAnnotation(ctx, annotation)
      })
    }
    img.src = screenshot
  }

  const drawAnnotation = (ctx: CanvasRenderingContext2D, annotation: Annotation) => {
    ctx.strokeStyle = annotation.color
    ctx.fillStyle = annotation.color
    ctx.lineWidth = 3

    switch (annotation.type) {
      case "box":
        ctx.strokeRect(annotation.x, annotation.y, annotation.width || 0, annotation.height || 0)
        break

      case "arrow":
        if (annotation.endX && annotation.endY) {
          drawArrow(ctx, annotation.x, annotation.y, annotation.endX, annotation.endY, annotation.color)
        }
        break

      case "highlight":
        ctx.globalAlpha = 0.3
        ctx.fillRect(annotation.x, annotation.y, annotation.width || 0, annotation.height || 0)
        ctx.globalAlpha = 1
        break

      case "text":
        ctx.font = "16px sans-serif"
        ctx.fillText(annotation.text || "", annotation.x, annotation.y)
        break
    }
  }

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
  ) => {
    const headLength = 15
    const angle = Math.atan2(toY - fromY, toX - fromX)

    ctx.beginPath()
    ctx.moveTo(fromX, fromY)
    ctx.lineTo(toX, toY)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(toX, toY)
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6))
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6))
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "select") return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setStartPos({ x, y })

    if (tool === "text") {
      const text = prompt("Enter text:")
      if (text) {
        const newAnnotation: Annotation = {
          id: Date.now().toString(),
          type: "text",
          x,
          y,
          text,
          color,
        }
        onAnnotationsChange([...annotations, newAnnotation])
      }
      setIsDrawing(false)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === "select" || tool === "text") return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    let annotation: Annotation | null = null

    switch (tool) {
      case "box":
      case "highlight":
        annotation = {
          id: "temp",
          type: tool,
          x: Math.min(startPos.x, x),
          y: Math.min(startPos.y, y),
          width: Math.abs(x - startPos.x),
          height: Math.abs(y - startPos.y),
          color,
        }
        break

      case "arrow":
        annotation = {
          id: "temp",
          type: "arrow",
          x: startPos.x,
          y: startPos.y,
          endX: x,
          endY: y,
          color,
        }
        break
    }

    setCurrentAnnotation(annotation)
  }

  const handleMouseUp = () => {
    if (isDrawing && currentAnnotation && currentAnnotation.id === "temp") {
      const newAnnotation = { ...currentAnnotation, id: Date.now().toString() }
      onAnnotationsChange([...annotations, newAnnotation])
      setCurrentAnnotation(null)
    }
    setIsDrawing(false)
  }

  const handleUndo = () => {
    if (annotations.length > 0) {
      onAnnotationsChange(annotations.slice(0, -1))
    }
  }

  const handleClear = () => {
    onAnnotationsChange([])
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ToggleGroup type="single" value={tool} onValueChange={(value: any) => value && setTool(value)}>
              <ToggleGroupItem value="select" aria-label="Select">
                <MousePointer className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="arrow" aria-label="Arrow">
                <ArrowRight className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="box" aria-label="Box">
                <Square className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="highlight" aria-label="Highlight">
                <Highlighter className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="text" aria-label="Text">
                <Type className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            <div className="h-6 w-px bg-border" />

            <div className="flex gap-2">
              {["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"].map((c) => (
                <button
                  key={c}
                  className={`h-6 w-6 rounded-full border-2 ${color === c ? "border-foreground" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleUndo} disabled={annotations.length === 0}>
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleClear} disabled={annotations.length === 0}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden p-4">
        <div ref={containerRef} className="relative overflow-auto">
          <canvas
            ref={canvasRef}
            className="max-w-full cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      </Card>

      {annotations.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {annotations.length} annotation{annotations.length !== 1 ? "s" : ""} added
        </p>
      )}
    </div>
  )
}
