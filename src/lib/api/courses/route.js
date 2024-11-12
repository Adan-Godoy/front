// src/app/api/courses/route.js

import courses from '@/data/mockCourses.json';

export async function GET(request) {
  return new Response(JSON.stringify(courses), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
