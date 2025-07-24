import TravelGuideEditor from '../edit/[id]/page'

export default function NewTravelGuidePage() {
  return <TravelGuideEditor params={Promise.resolve({ id: 'new' })} />
}