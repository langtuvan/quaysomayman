import RandomFortuneForm from '@/sections/main/fortune/random/RandomFortune'


const TEST_DATA = {
  id: '',
  title: 'Sổ số may mắn',
  prizes: [
    { id: '1', name: '🎟️ Giải Đặc Biệt', qty: 1 },
    { id: '2', name: '📱 Giải Nhất', qty: 1 },
    { id: '3', name: '📱 Giải Nhì', qty: 1 },
    { id: '4', name: '🎁 Giải Ba', qty: 1 },
    { id: '5', name: '💰 Giải Tư', qty: 1 },
    { id: '6', name: '💰 Giải khuyến khích', qty: 1 },
    { id: '7', name: '💰 TESST DATA', qty: 1 },
  ],
  winners: [],
}


export default function FortuneRandomPage() {
  return (
    <div className="grid grid-cols-1">
      <div className="my-9 flex w-full flex-col items-center justify-around gap-16">
        <RandomFortuneForm currentData={TEST_DATA} demo autoPlay={true} />
      </div>
    </div>
  )
}
