'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import messages from '@/data/messages.json'
import { MessageCircle, Sparkles, TrendingUp } from 'lucide-react'


const Home = () => {

  return (
    <>
      <main className='grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
        <section className='text-center mb-12 md:mb-16'>
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 mb-4'>
            <Sparkles className='w-4 h-4 text-blue-600' />
            <span className='text-sm font-semibold text-blue-600'>Real Feedback, Real Impact</span>
          </div>
          <h1 className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
            Dive into Anonymous Conversations
          </h1>
          <p className='mt-4 md:mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto'>
            Explore InsightLoop - Collect genuine feedback, gain deeper insights, and make smarter decisions
          </p>
        </section>

        <div className="w-full flex justify-center mb-8">
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full max-w-2xl">
            <CarouselContent className="-ml-2 md:-ml-4">
              {
                messages.map((message, index) => {
                  return (
                    <CarouselItem key={index} className="pl-2 md:pl-4 basis-full">
                      <div className="h-full">
                        <Card className="h-full bg-gradient-to-br from-white via-blue-50 to-indigo-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                          {/* Decorative gradient blur */}
                          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-10 blur-3xl -mr-20 -mt-20"></div>

                          <CardHeader className="pb-4 pt-6 relative z-10">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                </div>
                                <span className="text-sm font-semibold text-gray-600">Message</span>
                              </div>
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                {message.receivedTime}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 leading-tight">
                              {message.title}
                            </h3>
                          </CardHeader>

                          <CardContent className="pb-6 relative z-10">
                            <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-50">
                              <p className="text-gray-700 leading-relaxed text-base font-medium">
                                "{message.content}"
                              </p>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-400"></div>
                              <span className="text-xs text-gray-500 font-medium">Anonymous</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  );
                })
              }
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-16 hover:bg-blue-600 hover:text-white transition-colors" />
            <CarouselNext className="hidden md:flex -right-16 hover:bg-blue-600 hover:text-white transition-colors" />
          </Carousel>
        </div>

        {/* Carousel indicators/dots */}
        <div className="flex gap-2 justify-center">
          {messages.map((_, index) => (
            <div
              key={index}
              className="h-2 rounded-full transition-all duration-300 bg-gray-300 hover:bg-blue-600 cursor-pointer"
              style={{ width: index === 0 ? '24px' : '8px' }}
            ></div>
          ))}
        </div>

      </main>
      <footer className="text-center text-sm text-gray-600 p-4 sm:p-6 border-t border-gray-200">
        © 2026 InsightLoop. All rights reserved
      </footer>
    </>
  )
}

export default Home