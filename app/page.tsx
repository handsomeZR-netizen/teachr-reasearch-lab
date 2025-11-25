/**
 * Home Page
 * 
 * Landing page with Hero section and three-step process overview
 * Requirements: 10.4
 */

'use client';

import Link from 'next/link';
import { BookOpen, Wrench, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { OnboardingTour } from '@/components/onboarding-tour';
import { homePageSteps } from '@/lib/onboarding-steps';

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      
      {/* Onboarding Tour */}
      <OnboardingTour steps={homePageSteps} tourId="home-page" />
      
      <main>
        {/* Hero Section */}
        <section id="hero-section" className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight">
                AI 驱动的
                <br />
                <span className="text-primary">教学研究实验室</span>
              </h1>
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
                面向全学科一线教师的科研辅助工具。通过 AI 模拟不同认知水平的学生，
                完成从选题到成果的完整科研闭环。无需代码知识，即刻开始你的教学研究。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/workshop" id="workshop-link">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg hover:scale-105 transition-transform"
                  >
                    开始研究
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/cases" id="cases-link">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto border-primary text-primary hover:bg-primary-light px-8 py-6 text-lg hover:scale-105 transition-transform"
                  >
                    浏览案例
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* 3D UI Mockup - AI 对话界面样机 - 可点击跳转到精选案例 */}
            <Link href="/cases/featured" className="block cursor-pointer group">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotateY: -5 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative perspective-1000"
              style={{ perspective: '1000px' }}
            >
              {/* 主卡片 - 玻璃拟态风格 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
                style={{ 
                  transform: 'rotateX(2deg) rotateY(-3deg)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
                }}
              >
                {/* 窗口标题栏 */}
                <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex items-center gap-2 text-primary font-medium text-sm">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    AI 备课助手 V2.0
                  </div>
                </div>

                {/* 对话内容区 */}
                <div className="p-5 space-y-4">
                  {/* 用户消息 */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                      <p className="text-text-primary text-sm leading-relaxed">
                        分析小学三年级<span className="text-primary font-medium">《长方形面积》</span>的常见易错点。
                      </p>
                    </div>
                  </div>

                  {/* AI 回复 */}
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] border border-primary/20">
                      <p className="text-text-primary text-sm leading-relaxed">
                        正在分析... 检测到 <span className="text-orange-500 font-semibold">2 个核心误区</span>。
                        <br />
                        <span className="text-text-secondary">正在模拟学生反馈...</span>
                      </p>
                    </div>
                    <motion.div 
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                    >
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* 分析结果卡片 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </div>
                      <span className="font-semibold text-text-primary text-sm">核心易错点预测</span>
                    </div>
                    
                    {/* 进度条 1 */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-secondary">混淆"周长"与"面积"概念</span>
                          <span className="text-red-500 font-semibold">85% 极高</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '85%' }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full"
                          />
                        </div>
                      </div>
                      
                      {/* 进度条 2 */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-text-secondary">长宽单位换算错误</span>
                          <span className="text-orange-500 font-semibold">42% 中等</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '42%' }}
                            transition={{ duration: 1, delay: 1 }}
                            className="h-full bg-gradient-to-r from-orange-300 to-orange-400 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* 输入框 */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    </div>
                    <div className="flex-1 h-10 bg-gray-50 rounded-full border border-gray-200" />
                  </div>
                </div>
              </motion.div>

              {/* 浮动装饰元素 - 尺子图标 */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -left-4 top-1/4 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center border border-gray-100"
              >
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 12h20M2 12l4-4m-4 4l4 4M22 12l-4-4m4 4l-4 4" />
                </svg>
              </motion.div>

              {/* 浮动装饰元素 - 几何方形 */}
              <motion.div
                animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -right-3 top-1/3 w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/30 rounded-lg shadow-md border-2 border-primary/40"
              />

              {/* 浮动装饰元素 - 分数饼图 */}
              <motion.div
                animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute -right-6 bottom-1/4 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-100"
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="#E8F5F3" stroke="#14B8A6" strokeWidth="2" />
                  <path d="M12 2 A10 10 0 0 1 22 12 L12 12 Z" fill="#14B8A6" />
                </svg>
              </motion.div>

              {/* 通知徽章 - 教案已生成 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute -right-2 top-16"
              >
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-gradient-to-r from-primary to-teal-400 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg"
                >
                  ✓ 教案已生成
                </motion.div>
              </motion.div>

              {/* 点击提示 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="bg-text-primary/90 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap">
                  点击查看完整研究案例 →
                </div>
              </motion.div>
            </motion.div>
            </Link>
          </div>
        </section>

        {/* Three-Step Process Section */}
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                三步完成教学研究
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                从灵感到成果，AI 全程辅助你的科研之旅
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Step 1: 看案例 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative group"
              >
                <div className="bg-bg-main rounded-2xl p-8 h-full border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6"
                  >
                    <BookOpen className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-text-primary mb-3">
                    看案例
                  </h3>
                  <p className="text-text-secondary leading-relaxed mb-4">
                    浏览多学科教学研究案例，获取灵感和参考范式。从数学到语文，从物理到英语，丰富的案例库助你快速入门。
                  </p>
                  <Link 
                    href="/cases" 
                    className="inline-flex items-center text-primary hover:underline font-medium"
                  >
                    浏览案例馆
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
                {/* Arrow for desktop */}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10"
                >
                  <ArrowRight className="w-8 h-8 text-primary/30" />
                </motion.div>
              </motion.div>

              {/* Step 2: 搭脚手架 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative group"
              >
                <div className="bg-bg-main rounded-2xl p-8 h-full border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6"
                  >
                    <Wrench className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-text-primary mb-3">
                    搭脚手架
                  </h3>
                  <p className="text-text-secondary leading-relaxed mb-4">
                    AI 辅助确定研究选题，生成文献综述草稿。通过模拟不同认知水平的学生，测试你的教学设计。
                  </p>
                  <Link 
                    href="/workshop" 
                    className="inline-flex items-center text-primary hover:underline font-medium"
                  >
                    进入工坊
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
                {/* Arrow for desktop */}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10"
                >
                  <ArrowRight className="w-8 h-8 text-primary/30" />
                </motion.div>
              </motion.div>

              {/* Step 3: 出成果 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="group"
              >
                <div className="bg-bg-main rounded-2xl p-8 h-full border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6"
                  >
                    <FileText className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-text-primary mb-3">
                    出成果
                  </h3>
                  <p className="text-text-secondary leading-relaxed mb-4">
                    导出包含可视化分析的研究报告，用于论文写作或教研分享。雷达图展示教学效果的多维度评估。
                  </p>
                  <Link 
                    href="/workshop" 
                    className="inline-flex items-center text-primary hover:underline font-medium"
                  >
                    开始研究
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              准备好开始你的教学研究了吗？
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              无需复杂配置，无需编程知识。现在就开始，让 AI 成为你的科研助手。
            </p>
            <Link href="/workshop">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
                >
                  立即开始
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-text-secondary">
          <p>© 2024 模拟教学研究实验室. 面向全学科一线教师的 AI 科研辅助工具.</p>
        </div>
      </footer>
    </div>
  );
}
