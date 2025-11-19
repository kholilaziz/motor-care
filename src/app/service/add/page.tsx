'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Wrench, ArrowLeft, Save, Plus, X } from 'lucide-react'

export default function AddServicePage() {
  const [formData, setFormData] = useState({
    motorcycleId: '',
    date: '',
    km: '',
    notes: '',
    cost: ''
  })
  const [actions, setActions] = useState<string[]>([])
  const [spareparts, setSpareparts] = useState<string[]>([])
  const [newAction, setNewAction] = useState('')
  const [newSparepart, setNewSparepart] = useState('')
  const [motorcycles, setMotorcycles] = useState([])
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

    // Load motorcycles
    loadMotorcycles()
  }, [router])

  const loadMotorcycles = async () => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        const response = await fetch(`/api/motorcycles?userId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setMotorcycles(data)
        }
      }
    } catch (error) {
      console.error('Error loading motorcycles:', error)
    }
  }

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

  const addAction = () => {
    if (newAction.trim() && !actions.includes(newAction.trim())) {
      setActions([...actions, newAction.trim()])
      setNewAction('')
    }
  }

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index))
  }

  const addSparepart = () => {
    if (newSparepart.trim() && !spareparts.includes(newSparepart.trim())) {
      setSpareparts([...spareparts, newSparepart.trim()])
      setNewSparepart('')
    }
  }

  const removeSparepart = (index: number) => {
    setSpareparts(spareparts.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (actions.length === 0) {
      setError('Minimal satu tindakan servis harus ditambahkan')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/service-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          km: parseInt(formData.km),
          cost: formData.cost ? parseInt(formData.cost) : null,
          actions,
          spareparts: spareparts.length > 0 ? spareparts : null,
          userId: user.id
        })
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/')
      } else {
        setError(data.error || 'Gagal menambahkan riwayat servis')
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
                <h1 className="text-2xl font-bold">Catat Servis</h1>
                <p className="text-sm text-muted-foreground">Tambahkan riwayat servis motor</p>
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
              <CardTitle>Informasi Servis</CardTitle>
              <CardDescription>
                Catat detail servis yang telah dilakukan pada motor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Informasi Umum */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informasi Umum</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="motorcycleId">Motor *</Label>
                      <Select value={formData.motorcycleId} onValueChange={(value) => handleSelectChange('motorcycleId', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih motor" />
                        </SelectTrigger>
                        <SelectContent>
                          {motorcycles.map((motor) => (
                            <SelectItem key={motor.id} value={motor.id}>
                              {motor.brand} {motor.model} - {motor.plateNumber}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Tanggal Servis *</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="km">KM Saat Servis *</Label>
                      <Input
                        id="km"
                        name="km"
                        type="number"
                        placeholder="15000"
                        value={formData.km}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cost">Biaya (Rp)</Label>
                      <Input
                        id="cost"
                        name="cost"
                        type="number"
                        placeholder="250000"
                        value={formData.cost}
                        onChange={handleChange}
                        disabled={isLoading}
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Tindakan Servis */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tindakan Servis *</h3>
                  
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Contoh: Ganti oli mesin"
                        value={newAction}
                        onChange={(e) => setNewAction(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAction())}
                        disabled={isLoading}
                      />
                      <Button type="button" onClick={addAction} disabled={isLoading}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {actions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {actions.map((action, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {action}
                            <button
                              type="button"
                              onClick={() => removeAction(index)}
                              className="ml-1 hover:text-destructive"
                              disabled={isLoading}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sparepart */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Sparepart yang Diganti (Opsional)</h3>
                  
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Contoh: Filter oli"
                        value={newSparepart}
                        onChange={(e) => setNewSparepart(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSparepart())}
                        disabled={isLoading}
                      />
                      <Button type="button" onClick={addSparepart} disabled={isLoading}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {spareparts.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {spareparts.map((sparepart, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            {sparepart}
                            <button
                              type="button"
                              onClick={() => removeSparepart(index)}
                              className="ml-1 hover:text-destructive"
                              disabled={isLoading}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Catatan */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Catatan Tambahan</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Catatan</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Masukkan catatan tambahan tentang servis..."
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={3}
                      disabled={isLoading}
                    />
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
                    {isLoading ? 'Menyimpan...' : 'Simpan Servis'}
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