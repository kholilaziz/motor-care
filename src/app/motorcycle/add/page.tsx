'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Wrench, ArrowLeft, Save } from 'lucide-react'

export default function AddMotorcyclePage() {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    variant: '',
    plateNumber: '',
    year: '',
    stnkExpiry: '',
    usageType: '',
    initialKm: '',
    currentKm: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Cek user login
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/auth/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/motorcycles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          year: parseInt(formData.year),
          initialKm: parseInt(formData.initialKm),
          currentKm: formData.currentKm ? parseInt(formData.currentKm) : parseInt(formData.initialKm),
          userId: user.id
        })
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/')
      } else {
        setError(data.error || 'Gagal menambahkan motor')
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Tambah Motor</h1>
                <p className="text-sm text-muted-foreground">Daftarkan motor baru Anda</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Motor</CardTitle>
              <CardDescription>
                Lengkapi data motor Anda untuk mulai mencatat riwayat servis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Informasi Dasar */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informasi Dasar</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand *</Label>
                      <Select value={formData.brand} onValueChange={(value) => handleSelectChange('brand', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Honda">Honda</SelectItem>
                          <SelectItem value="Yamaha">Yamaha</SelectItem>
                          <SelectItem value="Suzuki">Suzuki</SelectItem>
                          <SelectItem value="Kawasaki">Kawasaki</SelectItem>
                          <SelectItem value="Ducati">Ducati</SelectItem>
                          <SelectItem value="KTM">KTM</SelectItem>
                          <SelectItem value="Lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        name="model"
                        type="text"
                        placeholder="CBR150R, NMAX, dll"
                        value={formData.model}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="variant">Varian</Label>
                      <Input
                        id="variant"
                        name="variant"
                        type="text"
                        placeholder="Repsol, ABS, dll"
                        value={formData.variant}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="plateNumber">Nomor Plat *</Label>
                      <Input
                        id="plateNumber"
                        name="plateNumber"
                        type="text"
                        placeholder="B 1234 ABC"
                        value={formData.plateNumber}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Tahun *</Label>
                      <Input
                        id="year"
                        name="year"
                        type="number"
                        placeholder="2022"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        min="1990"
                        max={new Date().getFullYear() + 1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stnkExpiry">Masa Berlaku STNK *</Label>
                      <Input
                        id="stnkExpiry"
                        name="stnkExpiry"
                        type="date"
                        value={formData.stnkExpiry}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Penggunaan dan Kilometer */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Penggunaan dan Kilometer</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="usageType">Tipe Penggunaan *</Label>
                      <Select value={formData.usageType} onValueChange={(value) => handleSelectChange('usageType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe penggunaan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="harian">Harian (Komuter)</SelectItem>
                          <SelectItem value="komuter">Komuter Jarak Jauh</SelectItem>
                          <SelectItem value="touring">Touring</SelectItem>
                          <SelectItem value="olahraga">Olahraga/Hobi</SelectItem>
                          <SelectItem value="jarang">Jarang Digunakan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="initialKm">KM Awal *</Label>
                      <Input
                        id="initialKm"
                        name="initialKm"
                        type="number"
                        placeholder="0"
                        value={formData.initialKm}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentKm">KM Saat Ini</Label>
                      <Input
                        id="currentKm"
                        name="currentKm"
                        type="number"
                        placeholder="Kosongkan jika sama dengan KM awal"
                        value={formData.currentKm}
                        onChange={handleChange}
                        disabled={isLoading}
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-4">
                  <Link href="/">
                    <Button variant="outline" disabled={isLoading}>
                      Batal
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Menyimpan...' : 'Simpan Motor'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}