import UpLoadForm from '../../components/uploadform/UpLoadForm';

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Upload a File</h1>
      <UpLoadForm />
    </main> 
  );
}
