"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  GlassCard,
  NeumorphicCard,
  GradientBackground,
  NeonText,
  AnimatedElement,
} from "@/components/ui/styled-components"
import { useThemeSettings } from "@/lib/theme/theme-context"
import { Sparkles, Zap, Palette, Layers } from "lucide-react"

export function ThemeDemo() {
  const { settings } = useThemeSettings()

  return (
    <div className="space-y-8 py-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">معرض الأنماط</h2>
        <p className="text-muted-foreground">استعرض مكونات واجهة المستخدم بمختلف الأنماط والتأثيرات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Standard Card */}
        <Card>
          <CardHeader>
            <CardTitle>بطاقة قياسية</CardTitle>
            <CardDescription>هذه بطاقة بالتصميم الافتراضي</CardDescription>
          </CardHeader>
          <CardContent>
            <p>يمكنك استخدام هذه البطاقة لعرض المحتوى بطريقة أنيقة ومنظمة.</p>
          </CardContent>
          <CardFooter>
            <Button>زر أساسي</Button>
          </CardFooter>
        </Card>

        {/* Glass Card */}
        <GlassCard className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">بطاقة زجاجية</h3>
              <p className="text-sm text-muted-foreground">تأثير الزجاج الشفاف</p>
            </div>
            <p>تضيف هذه البطاقة تأثير الزجاج الشفاف للحصول على مظهر عصري.</p>
            <Button variant="outline" className="w-full">
              زر ثانوي
            </Button>
          </div>
        </GlassCard>

        {/* Neumorphic Card */}
        <NeumorphicCard className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">بطاقة نيومورفيك</h3>
              <p className="text-sm text-muted-foreground">تأثير النيومورفيزم</p>
            </div>
            <p>تضيف هذه البطاقة تأثير النيومورفيزم للحصول على مظهر ثلاثي الأبعاد.</p>
            <Button variant="secondary" className="w-full">
              زر ثانوي
            </Button>
          </div>
        </NeumorphicCard>

        {/* Gradient Background */}
        <GradientBackground className="p-6 rounded-lg text-white">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">خلفية متدرجة</h3>
              <p className="text-sm opacity-80">تدرج ألوان جميل</p>
            </div>
            <p>تضيف هذه البطاقة خلفية بتدرج لوني للحصول على مظهر حيوي.</p>
            <Button variant="outline" className="border-white text-white hover:bg-white/20 hover:text-white w-full">
              زر شفاف
            </Button>
          </div>
        </GradientBackground>

        {/* Neon Text */}
        <Card className="p-6 flex flex-col items-center justify-center text-center">
          <div className="space-y-6">
            <NeonText color="primary" intensity="high" className="text-2xl font-bold">
              نص نيون
            </NeonText>
            <p>يضيف تأثير النيون توهجًا للنص يجعله يبرز بشكل جذاب.</p>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <NeonText color="primary" className="text-lg">
                أساسي
              </NeonText>
              <NeonText color="secondary" className="text-lg">
                ثانوي
              </NeonText>
              <NeonText color="accent" className="text-lg">
                مميز
              </NeonText>
            </div>
          </div>
        </Card>

        {/* Animated Elements */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">عناصر متحركة</h3>
            <div className="space-y-4">
              <AnimatedElement animation="fade" className="p-3 bg-primary/10 rounded-md">
                ظهور تدريجي
              </AnimatedElement>
              <AnimatedElement animation="slide" delay={200} className="p-3 bg-secondary/10 rounded-md">
                انزلاق للأعلى
              </AnimatedElement>
              <AnimatedElement animation="scale" delay={400} className="p-3 bg-accent/10 rounded-md">
                تكبير
              </AnimatedElement>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">الأزرار والشارات</h3>
          <div className="flex flex-wrap gap-2">
            <Button>أساسي</Button>
            <Button variant="secondary">ثانوي</Button>
            <Button variant="outline">محيط</Button>
            <Button variant="ghost">شبح</Button>
            <Button variant="link">رابط</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>افتراضي</Badge>
            <Badge variant="secondary">ثانوي</Badge>
            <Badge variant="outline">محيط</Badge>
            <Badge variant="destructive">تحذير</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold">أيقونات مع تأثيرات</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className={`p-3 rounded-full ${settings.enableGlassmorphism ? "glass-card" : "bg-primary/10"}`}>
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm">تأثيرات</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className={`p-3 rounded-full ${settings.enableGlassmorphism ? "glass-card" : "bg-secondary/10"}`}>
                <Zap className="h-6 w-6 text-secondary" />
              </div>
              <span className="text-sm">سرعة</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className={`p-3 rounded-full ${settings.enableGlassmorphism ? "glass-card" : "bg-accent/10"}`}>
                <Palette className="h-6 w-6 text-accent" />
              </div>
              <span className="text-sm">ألوان</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className={`p-3 rounded-full ${settings.enableGlassmorphism ? "glass-card" : "bg-primary/10"}`}>
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm">طبقات</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
