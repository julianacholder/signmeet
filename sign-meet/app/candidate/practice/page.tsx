'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Video, VideoOff, Settings, User, Play, ListRestart, RotateCcw } from 'lucide-react';

export default function PracticePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [progress, setProgress] = useState(33);

  const courses = [
    {
      id: 1,
      level: 'BEGINNER',
      title: 'Introduction & Background',
      description: 'Practice telling me about yourself, strengths, and career goals in RSL',
      badge: 'Basic',
      levelColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 2,
      level: 'INTERMEDIATE',
      title: 'Behavioral Questions',
      description: 'Practice STAR method responses and workplace scenario questions in RSL',
      badge: 'Intermediate',
      levelColor: 'bg-orange-100 text-orange-700'
    },
    {
      id: 3,
      level: 'ADVANCED',
      title: 'Technical & Leadership',
      description: 'Practice complex role-specific questions and leadership scenarios in RSL',
      badge: 'Advanced',
      levelColor: 'bg-purple-100 text-purple-700'
    },
    
  ];

  const practiceTips = [
    'Practice your responses in RSL before the actual interview',
    'Ensure good lighting so your signs are clearly visible',
    'Maintain eye contact with the camera while signing',
    'Keep your signing space clear with a neutral background'
  ];

  return (
   <div className="p-4 md:p-6 lg:p-10">
  {/* Course Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8">
        {courses.map((course) => (
          <Card key={course.id} className="py-3">
            {/* Three dots menu */}
            <div className="flex justify-end px-4">
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>

            {/* Content Group */}
            <div className="mt-2">
              <CardHeader className='gap-2'>
                <Badge variant="secondary" className={`${course.levelColor} w-fit rounded-full text-[11px]`}>
                  {course.level}
                </Badge>
                <CardTitle className="text-md">{course.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {course.description}
                </p>
              </CardHeader>
             <CardContent className="flex flex-col items-center">
  <div className="w-full">
    <div className="flex items-center justify-between mb-1 mt-3">
      <span className="text-xs font-medium">Progress</span>
      <span className="text-xs text-muted-foreground">{progress}%</span>
    </div>
    <Progress value={progress} className="h-2" />
  </div>
  
 <Button variant="outline" className="w-60 max-w-full mt-5 flex items-center justify-center gap-2 border-gray-500 hover:border-primary/20 cursor-pointer">
  <Play className="w-4 h-4" />
  Practice
</Button>
</CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Practice Section */}
      <Card>
        <CardHeader  className='px-6 md:px-6 lg:px-10 gap-1 '>
          <CardTitle  className='text-lg'>Practice</CardTitle>
          <p className="text-sm text-muted-foreground">
            Master common interview topics with guided practice sessions
          </p>
        </CardHeader>
        <CardContent className='px-6 lg:px-10'>
         

          {/* Video Area */}
          <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center mb-6 relative">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMuted ? (
                  <MicOff className="w-5 h-5 text-white" />
                ) : (
                  <Mic className="w-5 h-5 text-white" />
                )}
              </button>

              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isVideoOff ? (
                  <VideoOff className="w-5 h-5 text-white" />
                ) : (
                  <Video className="w-5 h-5 text-white" />
                )}
              </button>

              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Settings Icon */}
            <button className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button 
              onClick={() => setIsRecording(!isRecording)}
              className="px-6 py-5"
            >
              {isRecording ? 'Stop Practice' : 'Start Practice'}
            </Button>
            <Button variant="outline" className="p-5">
              <RotateCcw className="w-5 h-5" />
              Reset
            </Button>
          </div>

          {/* Practice Tips */}
          <Card className="bg-primary/14 border-blue-200">
            <CardHeader>
              <CardTitle className="text-base">Practice Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {practiceTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}