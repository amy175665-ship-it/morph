import studioImage from '../assets/images/optimized/collection/06-artist-collaboration.webp';
import materialImage from '../assets/images/optimized/Journal/material.webp';
import spaceImage from '../assets/images/optimized/collection/02-void-lounge-terrace.webp';
import peopleImage from '../assets/images/optimized/about/about-founders-05.webp';

// 목록과 상세 페이지가 같은 이미지와 기사 데이터를 사용합니다.
// 본문 sections에도 image, alt를 추가하면 사진을 표시할 수 있습니다.
const journals = [
  {
    id: 1, slug: 'where-objects-begin', category: 'STUDIO',
    title: 'WHERE OBJECTS BEGIN', year: '2026',
    excerpt: 'Inside the MORPH studio, where selecting, arranging, and photographing objects becomes a shared conversation.',
    image: studioImage, alt: 'People discussing material samples around a reflective sculptural table in the MORPH studio',
    sections: [
      { heading: 'Looking together', text: 'An object rarely enters the gallery on its own. It arrives with references, material samples, and questions. Around the studio table, we look at how a curve catches light and how a surface changes beside another material. Choosing begins with this shared attention.' },
      { heading: 'Finding the frame', text: 'Arranging and photographing are part of the same process. We move a chair, adjust the distance between objects, and look again. The aim is to reveal a relationship between shape, light, and the space around it.' },
    ],
  },
  {
    id: 2, slug: 'surface-and-light', category: 'MATERIAL',
    title: 'SURFACE AND LIGHT', year: '2026',
    excerpt: 'A closer look at colour, texture, and the way light gives a surface its character.',
    image: materialImage, alt: 'Close-up of textured acid-green BLOCK LIGHT surfaces and warm illuminated panels',
    sections: [
      { heading: 'Beyond colour', text: 'At a distance, the BLOCK LIGHT reads as a bright geometric form. Up close, its surface becomes a landscape of fine texture, edges, and shadow. The colour is only one part of the experience; the way light meets the finish gives the object depth.' },
      { heading: 'Different ways of holding light', text: 'Chrome reflects its surroundings, glass lets light pass through, and an opaque coloured surface holds a more definite boundary. MORPH brings these different qualities together so that material becomes an active part of how we read a form.' },
    ],
  },
  {
    id: 3, slug: 'an-object-changes-a-room', category: 'SPACE',
    title: 'AN OBJECT CHANGES A ROOM', year: '2026',
    excerpt: 'A chrome lounge and a cobalt table bring a different rhythm to a quiet architectural space.',
    image: spaceImage, alt: 'A chrome VOID LOUNGE and cobalt BEND TABLE on a wide concrete terrace overlooking trees',
    sections: [
      { heading: 'A new point of attention', text: 'A room can change without changing its architecture. A reflective seat gathers the surrounding trees and concrete into its curved surface. Beside it, a blue table introduces a clear note of colour. Together they create a place to pause within the larger space.' },
      { heading: 'Room around the object', text: 'Empty space helps a form become visible. Rather than filling every corner, we look for the distance that lets an object breathe. Light, a passing shadow, and the view beyond the terrace complete the composition.' },
    ],
  },
  {
    id: 4, slug: 'the-people-behind-morph', category: 'PEOPLE',
    title: 'THE PEOPLE BEHIND MORPH', year: '2026',
    excerpt: 'Two friends, a shared studio, and an ongoing conversation about objects, spaces, and strange ideas.',
    image: peopleImage, alt: 'The MORPH founders and their team reviewing references and material samples around a studio worktable',
    sections: [
      { heading: 'A shared way of seeing', text: 'MORPH began with two friends and a shared fascination with objects that resist easy description. That curiosity continues around the studio table, where images, samples, and sketches become the starting point for a conversation.' },
      { heading: 'More than one perspective', text: 'One person notices a silhouette, another a texture or an unexpected connection. The work grows through these different observations. The studio is a place to compare ideas, rearrange them, and leave room for something neither person had planned.' },
    ],
  },
];

export default journals;
