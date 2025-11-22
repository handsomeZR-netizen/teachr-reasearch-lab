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

            {/* Video Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-video bg-gradient-to-br from-primary-light to-white rounded-2xl shadow-xl overflow-hidden border border-border"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center"
                  >
                    <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-primary border-b-[12px] border-b-transparent ml-1" />
                  </motion.div>
                  <p className="text-text-secondary">演示视频</p>
                </div>
              </div>
            </motion.div>
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
