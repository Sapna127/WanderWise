export default function Loginbox() {
  return (
    <div className="hidden md:flex fixed top-10 right-4 bg-white shadow-lg border z-10 border-gray-200 p-4 rounded-lg w-100 items-start">
      <span className="text-xl">🔐</span>
      <div className="ml-2">
        <h2 className="font-bold text-black">Unlock the best of wonderise</h2>
        <p className="text-gray-600 text-sm">Save itineraries, invite collaborators etc</p>
      </div>
    </div>
  );
}
