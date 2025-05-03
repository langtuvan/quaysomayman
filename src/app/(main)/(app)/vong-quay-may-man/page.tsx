import WheelFortuneForm from '@/sections/main/fortune/wheel/WheelFortune'

const TEST_DATA = {
  id: '',
  title: 'Vòng quay may mắn',
  persons: [],
  prizes: [
    { id: '1', name: '📱 iPhone 15', qty: 1 },
    { id: '2', name: '📱 laptop Dell', qty: 1 },
    { id: '3', name: '📱 Tivi', qty: 1 },
    { id: '4', name: '🎁 Quà Bí Mật', qty: 1 },
    { id: '5', name: '💰 Voucher 1.000K', qty: 1 },
    { id: '6', name: '💰 Voucher 500K', qty: 1 },
    { id: '7', name: '💰 Voucher 200K', qty: 2 },
    { id: '8', name: '🎟️ May mắn lần sau', qty: 10 },
  ],
  winners: [],
}

export default function FortuneWheelPage() {
  //client side

  return (
    <div className="mx-auto my-6 flex flex-col items-center justify-around gap-6 text-center leading-6">
      <WheelFortuneForm currentData={TEST_DATA} demo autoPlay={true} />
    </div>
  )
}
