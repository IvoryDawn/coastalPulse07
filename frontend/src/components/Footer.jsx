export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-12">
      <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Indian Ocean Hazard Reporting Platform
        </p>
        <div className="flex gap-4 text-sm text-gray-600">
          <a href="#" className="hover:text-blue-600">Contact</a>
          <a href="#" className="hover:text-blue-600">Twitter</a>
          <a href="#" className="hover:text-blue-600">Facebook</a>
        </div>
      </div>
    </footer>
  )
}
