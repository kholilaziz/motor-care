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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Wrench, ArrowLeft, Search, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react'

export default function ComplaintPage() {
  const [formData, setFormData] = useState({
    motorcycleId: '',
    description: ''
  })
  const [motorcycles, setMotorcycles] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [analysis, setAnalysis] = useState(null)
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      description: e.target.value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnalyzing(true)
    setError('')
    setAnalysis(null)

    if (!formData.description.trim()) {
      setError('Deskripsi keluhan harus diisi')
      setIsAnalyzing(false)
      return
    }

    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id
        })
      })

      const data = await response.json()

      if (response.ok) {
        setAnalysis(data.analysis)
      } else {
        setError(data.error || 'Gagal menganalisis keluhan')
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'tinggi':
        return 'destructive'
      case 'sedang':
        return 'default'
      case 'rendah':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'tinggi':
        return <AlertTriangle className="h-4 w-4" />
      case 'sedang':
        return <Clock className="h-4 w-4" />
      case 'rendah':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
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
                <h1 className="text-2xl font-bold">Analisis Keluhan</h1>
                <p className="text-sm text-muted-foreground">Dapatkan rekomendasi perbaikan dari AI</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Form Input */}
          <Card>
            <CardHeader>
              <CardTitle>Deskripsikan Keluhan Motor Anda</CardTitle>
              <CardDescription>
                Jelaskan masalah yang Anda alami dengan motor se-detail mungkin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalyze} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="motorcycleId">Motor *</Label>
                    <Select value={formData.motorcycleId} onValueChange={(value) => handleSelectChange('motorcycleId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih motor yang bermasalah" />
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
                    <Label htmlFor="description">Deskripsi Keluhan *</Label>
                    <Textarea
                      id="description"
                      placeholder="Contoh: Motor sulit distarter saat pagi hari, ada suara berisik dari bagian mesin, tarikan terasa berat, dll..."
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      disabled={isAnalyzing}
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Semakin detail deskripsi Anda, semakin akurat analisis yang akan diberikan.
                    </p>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isAnalyzing}>
                  <Search className="h-4 w-4 mr-2" />
                  {isAnalyzing ? 'Menganalisis...' : 'Analisis Keluhan'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Hasil Analisis */}
          {analysis && (
            <div className="space-y-6">
              {/* Diagnosis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="h-5 w-5 mr-2" />
                    Diagnosis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{analysis.diagnosis}</p>
                  
                  {analysis.symptoms && analysis.symptoms.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Gejala yang Terdeteksi:</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.symptoms.map((symptom: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Rekomendasi */}
              <Card>
                <CardHeader>
                  <CardTitle>Rekomendasi Perbaikan</CardTitle>
                  <CardDescription>
                    Tindakan yang perlu dilakukan berdasarkan analisis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.recommendations && analysis.recommendations.length > 0 ? (
                      analysis.recommendations.map((rec: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={getPriorityColor(rec.priority)} className="flex items-center gap-1">
                                  {getPriorityIcon(rec.priority)}
                                  {rec.priority}
                                </Badge>
                                {rec.estimated_cost && (
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    {rec.estimated_cost}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm">{rec.action}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">Tidak ada rekomendasi spesifik</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Tips Pencegahan */}
              {analysis.prevention && analysis.prevention.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tips Pencegahan</CardTitle>
                    <CardDescription>
                      Cara mencegah masalah serupa di masa depan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.prevention.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Link href="/service/add">
                  <Button>
                    <Wrench className="h-4 w-4 mr-2" />
                    Catat Servis
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => {
                  setAnalysis(null)
                  setFormData({ ...formData, description: '' })
                }}>
                  Analisis Ulang
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}