"use client"

import { useState } from "react"
import { useThemeSettings } from "@/lib/theme/theme-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Paintbrush, Type, Palette, Sliders, Sparkles, Layers, Maximize, Minimize, Zap, RotateCcw } from "lucide-react"
import { motion } from "framer-motion"

export function ThemeCustomizer() {
  const { settings, updateSettings, resetSettings, applyPreset } = useThemeSettings()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-12 h-12 bg-background/80 backdrop-blur-sm border border-border/50 shadow-md"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Customize theme"
      >
        <Paintbrush className="h-5 w-5" />
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-16 left-0 w-[340px] max-w-[calc(100vw-2rem)]"
        >
          <Card className="glass-card border-border/50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle>تخصيص المظهر</CardTitle>
              <CardDescription>قم بتخصيص مظهر التطبيق حسب تفضيلاتك</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="presets" className="w-full">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="presets" className="flex-1">
                    <Sparkles className="h-4 w-4 mr-2" />
                    <span>الأنماط</span>
                  </TabsTrigger>
                  <TabsTrigger value="colors" className="flex-1">
                    <Palette className="h-4 w-4 mr-2" />
                    <span>الألوان</span>
                  </TabsTrigger>
                  <TabsTrigger value="typography" className="flex-1">
                    <Type className="h-4 w-4 mr-2" />
                    <span>الخطوط</span>
                  </TabsTrigger>
                  <TabsTrigger value="effects" className="flex-1">
                    <Layers className="h-4 w-4 mr-2" />
                    <span>التأثيرات</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="presets" className="space-y-4">
                  <div className="space-y-2">
                    <Label>اختر نمطًا جاهزًا</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className={`h-auto py-4 ${settings.colorScheme === "default" ? "border-primary" : ""}`}
                        onClick={() => applyPreset("default")}
                      >
                        <div className="flex flex-col items-center">
                          <span>الافتراضي</span>
                          <div className="flex mt-2 space-x-1 rtl:space-x-reverse">
                            <div className="w-4 h-4 rounded-full bg-primary"></div>
                            <div className="w-4 h-4 rounded-full bg-secondary"></div>
                            <div className="w-4 h-4 rounded-full bg-accent"></div>
                          </div>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        className={`h-auto py-4 ${settings.colorScheme === "elegant" ? "border-primary" : ""}`}
                        onClick={() => applyPreset("minimal")}
                      >
                        <div className="flex flex-col items-center">
                          <span>بسيط</span>
                          <div className="flex mt-2 space-x-1 rtl:space-x-reverse">
                            <div className="w-4 h-4 rounded-full bg-slate-700"></div>
                            <div className="w-4 h-4 rounded-full bg-slate-500"></div>
                            <div className="w-4 h-4 rounded-full bg-slate-300"></div>
                          </div>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        className={`h-auto py-4 ${settings.colorScheme === "vibrant" ? "border-primary" : ""}`}
                        onClick={() => applyPreset("futuristic")}
                      >
                        <div className="flex flex-col items-center">
                          <span>مستقبلي</span>
                          <div className="flex mt-2 space-x-1 rtl:space-x-reverse">
                            <div className="w-4 h-4 rounded-full bg-violet-500"></div>
                            <div className="w-4 h-4 rounded-full bg-fuchsia-500"></div>
                            <div className="w-4 h-4 rounded-full bg-amber-400"></div>
                          </div>
                        </div>
                      </Button>
                      <Button
                        variant="outline"
                        className={`h-auto py-4 ${settings.colorScheme === "classic" ? "border-primary" : ""}`}
                        onClick={() => applyPreset("traditional")}
                      >
                        <div className="flex flex-col items-center">
                          <span>تقليدي</span>
                          <div className="flex mt-2 space-x-1 rtl:space-x-reverse">
                            <div className="w-4 h-4 rounded-full bg-blue-700"></div>
                            <div className="w-4 h-4 rounded-full bg-emerald-700"></div>
                            <div className="w-4 h-4 rounded-full bg-amber-600"></div>
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="colors" className="space-y-4">
                  <div className="space-y-2">
                    <Label>نظام الألوان</Label>
                    <RadioGroup
                      value={settings.colorScheme}
                      onValueChange={(value) => updateSettings({ colorScheme: value as any })}
                      className="grid grid-cols-2 gap-2"
                    >
                      <div>
                        <RadioGroupItem value="default" id="color-default" className="sr-only" />
                        <Label
                          htmlFor="color-default"
                          className={`flex items-center justify-between rounded-md border-2 border-muted p-3 hover:border-accent ${
                            settings.colorScheme === "default" ? "border-primary" : ""
                          }`}
                        >
                          <span>الافتراضي</span>
                          <div className="w-4 h-4 rounded-full bg-primary"></div>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="vibrant" id="color-vibrant" className="sr-only" />
                        <Label
                          htmlFor="color-vibrant"
                          className={`flex items-center justify-between rounded-md border-2 border-muted p-3 hover:border-accent ${
                            settings.colorScheme === "vibrant" ? "border-primary" : ""
                          }`}
                        >
                          <span>نابض</span>
                          <div className="w-4 h-4 rounded-full bg-violet-500"></div>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="elegant" id="color-elegant" className="sr-only" />
                        <Label
                          htmlFor="color-elegant"
                          className={`flex items-center justify-between rounded-md border-2 border-muted p-3 hover:border-accent ${
                            settings.colorScheme === "elegant" ? "border-primary" : ""
                          }`}
                        >
                          <span>أنيق</span>
                          <div className="w-4 h-4 rounded-full bg-slate-700"></div>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="modern" id="color-modern" className="sr-only" />
                        <Label
                          htmlFor="color-modern"
                          className={`flex items-center justify-between rounded-md border-2 border-muted p-3 hover:border-accent ${
                            settings.colorScheme === "modern" ? "border-primary" : ""
                          }`}
                        >
                          <span>عصري</span>
                          <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="classic" id="color-classic" className="sr-only" />
                        <Label
                          htmlFor="color-classic"
                          className={`flex items-center justify-between rounded-md border-2 border-muted p-3 hover:border-accent ${
                            settings.colorScheme === "classic" ? "border-primary" : ""
                          }`}
                        >
                          <span>كلاسيكي</span>
                          <div className="w-4 h-4 rounded-full bg-blue-700"></div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </TabsContent>

                <TabsContent value="typography" className="space-y-4">
                  <div className="space-y-2">
                    <Label>نمط الخطوط</Label>
                    <RadioGroup
                      value={settings.fontScheme}
                      onValueChange={(value) => updateSettings({ fontScheme: value as any })}
                      className="grid grid-cols-1 gap-2"
                    >
                      <div>
                        <RadioGroupItem value="default" id="font-default" className="sr-only" />
                        <Label
                          htmlFor="font-default"
                          className={`flex items-center justify-between rounded-md border-2 border-muted p-3 hover:border-accent ${
                            settings.fontScheme === "default" ? "border-primary" : ""
                          }`}
                        >
                          <span>الافتراضي</span>
                          <span className="text-sm opacity-70">Cairo</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="modern" id="font-modern" className="sr-only" />
                        <Label
                          htmlFor="font-modern"
                          className={`flex items-center justify-between rounded-md border-2 border-muted p-3 hover:border-accent ${
                            settings.fontScheme === "modern" ? "border-primary" : ""
                          }`}
                        >
                          <span>عصري</span>
                          <span className="text-sm opacity-70 font-light">Cairo Light</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="traditional" id="font-traditional" className="sr-only" />
                        <Label
                          htmlFor="font-traditional"
                          className={`flex items-center justify-between rounded-md border-2 border-muted p-3 hover:border-accent ${
                            settings.fontScheme === "traditional" ? "border-primary" : ""
                          }`}
                        >
                          <span>تقليدي</span>
                          <span className="text-sm opacity-70 font-serif">Amiri</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="playful" id="font-playful" className="sr-only" />
                        <Label
                          htmlFor="font-playful"
                          className={`flex items-center justify-between rounded-md border-2 border-muted p-3 hover:border-accent ${
                            settings.fontScheme === "playful" ? "border-primary" : ""
                          }`}
                        >
                          <span>مرح</span>
                          <span className="text-sm opacity-70 font-bold">Cairo Bold</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>حجم الزوايا</Label>
                      <span className="text-xs text-muted-foreground capitalize">{settings.borderRadius}</span>
                    </div>
                    <RadioGroup
                      value={settings.borderRadius}
                      onValueChange={(value) => updateSettings({ borderRadius: value as any })}
                      className="grid grid-cols-5 gap-2"
                    >
                      <div>
                        <RadioGroupItem value="none" id="radius-none" className="sr-only" />
                        <Label
                          htmlFor="radius-none"
                          className={`flex items-center justify-center rounded-none border-2 border-muted p-2 hover:border-accent ${
                            settings.borderRadius === "none" ? "border-primary" : ""
                          }`}
                        >
                          <div className="w-4 h-4 bg-primary"></div>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="small" id="radius-small" className="sr-only" />
                        <Label
                          htmlFor="radius-small"
                          className={`flex items-center justify-center rounded-sm border-2 border-muted p-2 hover:border-accent ${
                            settings.borderRadius === "small" ? "border-primary" : ""
                          }`}
                        >
                          <div className="w-4 h-4 rounded-sm bg-primary"></div>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="medium" id="radius-medium" className="sr-only" />
                        <Label
                          htmlFor="radius-medium"
                          className={`flex items-center justify-center rounded-md border-2 border-muted p-2 hover:border-accent ${
                            settings.borderRadius === "medium" ? "border-primary" : ""
                          }`}
                        >
                          <div className="w-4 h-4 rounded-md bg-primary"></div>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="large" id="radius-large" className="sr-only" />
                        <Label
                          htmlFor="radius-large"
                          className={`flex items-center justify-center rounded-lg border-2 border-muted p-2 hover:border-accent ${
                            settings.borderRadius === "large" ? "border-primary" : ""
                          }`}
                        >
                          <div className="w-4 h-4 rounded-lg bg-primary"></div>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="pill" id="radius-pill" className="sr-only" />
                        <Label
                          htmlFor="radius-pill"
                          className={`flex items-center justify-center rounded-full border-2 border-muted p-2 hover:border-accent ${
                            settings.borderRadius === "pill" ? "border-primary" : ""
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full bg-primary"></div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </TabsContent>

                <TabsContent value="effects" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>مستوى الحركة</Label>
                      <span className="text-xs text-muted-foreground capitalize">{settings.animationLevel}</span>
                    </div>
                    <RadioGroup
                      value={settings.animationLevel}
                      onValueChange={(value) => updateSettings({ animationLevel: value as any })}
                      className="grid grid-cols-4 gap-2"
                    >
                      <div>
                        <RadioGroupItem value="none" id="anim-none" className="sr-only" />
                        <Label
                          htmlFor="anim-none"
                          className={`flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:border-accent ${
                            settings.animationLevel === "none" ? "border-primary" : ""
                          }`}
                        >
                          <span className="text-xs">بدون</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="minimal" id="anim-minimal" className="sr-only" />
                        <Label
                          htmlFor="anim-minimal"
                          className={`flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:border-accent ${
                            settings.animationLevel === "minimal" ? "border-primary" : ""
                          }`}
                        >
                          <span className="text-xs">قليل</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="moderate" id="anim-moderate" className="sr-only" />
                        <Label
                          htmlFor="anim-moderate"
                          className={`flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:border-accent ${
                            settings.animationLevel === "moderate" ? "border-primary" : ""
                          }`}
                        >
                          <span className="text-xs">متوسط</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="extensive" id="anim-extensive" className="sr-only" />
                        <Label
                          htmlFor="anim-extensive"
                          className={`flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:border-accent ${
                            settings.animationLevel === "extensive" ? "border-primary" : ""
                          }`}
                        >
                          <span className="text-xs">كثير</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>الكثافة</Label>
                      <span className="text-xs text-muted-foreground capitalize">{settings.density}</span>
                    </div>
                    <RadioGroup
                      value={settings.density}
                      onValueChange={(value) => updateSettings({ density: value as any })}
                      className="grid grid-cols-3 gap-2"
                    >
                      <div>
                        <RadioGroupItem value="compact" id="density-compact" className="sr-only" />
                        <Label
                          htmlFor="density-compact"
                          className={`flex items-center justify-center rounded-md border-2 border-muted p-2 hover:border-accent ${
                            settings.density === "compact" ? "border-primary" : ""
                          }`}
                        >
                          <Minimize className="h-4 w-4" />
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="comfortable" id="density-comfortable" className="sr-only" />
                        <Label
                          htmlFor="density-comfortable"
                          className={`flex items-center justify-center rounded-md border-2 border-muted p-2 hover:border-accent ${
                            settings.density === "comfortable" ? "border-primary" : ""
                          }`}
                        >
                          <Sliders className="h-4 w-4" />
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="spacious" id="density-spacious" className="sr-only" />
                        <Label
                          htmlFor="density-spacious"
                          className={`flex items-center justify-center rounded-md border-2 border-muted p-2 hover:border-accent ${
                            settings.density === "spacious" ? "border-primary" : ""
                          }`}
                        >
                          <Maximize className="h-4 w-4" />
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Switch
                          id="glassmorphism"
                          checked={settings.enableGlassmorphism}
                          onCheckedChange={(checked) => updateSettings({ enableGlassmorphism: checked })}
                        />
                        <Label htmlFor="glassmorphism">تأثير الزجاج</Label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Switch
                          id="neumorphism"
                          checked={settings.enableNeumorphism}
                          onCheckedChange={(checked) => updateSettings({ enableNeumorphism: checked })}
                        />
                        <Label htmlFor="neumorphism">تأثير النيومورفيزم</Label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Switch
                          id="gradients"
                          checked={settings.enableGradients}
                          onCheckedChange={(checked) => updateSettings({ enableGradients: checked })}
                        />
                        <Label htmlFor="gradients">تدرجات الألوان</Label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Switch
                          id="neon"
                          checked={settings.enableNeonEffects}
                          onCheckedChange={(checked) => updateSettings({ enableNeonEffects: checked })}
                        />
                        <Label htmlFor="neon">تأثيرات النيون</Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between pt-0">
              <Button variant="outline" onClick={resetSettings}>
                <RotateCcw className="h-4 w-4 mr-2" />
                إعادة ضبط
              </Button>
              <Button onClick={() => setIsOpen(false)}>
                <Zap className="h-4 w-4 mr-2" />
                تطبيق
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
