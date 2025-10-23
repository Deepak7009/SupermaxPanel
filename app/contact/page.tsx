export default function ContactPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <form className="mt-4 space-y-4 max-w-md">
        <input type="text" placeholder="Name" className="border p-2 w-full" />
        <input type="email" placeholder="Email" className="border p-2 w-full" />
        <textarea placeholder="Message" className="border p-2 w-full"></textarea>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
          Send
        </button>
      </form>
    </div>
  );
}
