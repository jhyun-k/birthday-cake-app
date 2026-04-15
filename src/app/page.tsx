import CakeCreator from '@/components/CakeCreator';

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      {/* Hero section */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-4 animate-float">🎂</div>
        <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 bg-clip-text text-transparent">
          생일케이크를 꾸며줘!
        </h1>
        <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
          소중한 사람의 생일 케이크를 만들고
          <br />
          친구들이 토핑과 함께 축하 메시지를 남길 수 있어요
        </p>
      </div>

      {/* How it works */}
      <div className="flex gap-4 mb-10 text-center max-w-lg">
        <div className="flex-1 p-3">
          <div className="text-2xl mb-1">1️⃣</div>
          <p className="text-xs text-gray-500">케이크를 만들고</p>
        </div>
        <div className="flex-1 p-3">
          <div className="text-2xl mb-1">2️⃣</div>
          <p className="text-xs text-gray-500">링크를 공유하면</p>
        </div>
        <div className="flex-1 p-3">
          <div className="text-2xl mb-1">3️⃣</div>
          <p className="text-xs text-gray-500">친구들이 꾸며줘요!</p>
        </div>
      </div>

      {/* Cake creation form */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-pink-100">
        <h2 className="text-lg font-bold text-gray-800 mb-6 text-center">
          새로운 케이크 만들기
        </h2>
        <CakeCreator />
      </div>
    </div>
  );
}
