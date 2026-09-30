<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageView;
use App\Models\PortfolioItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * Record a page view hit from front-end
     */
    public function track(Request $request)
    {
        // 1. Exclude if logged in via Laravel Auth
        if (Auth::check()) {
            return response()->json([
                'status' => 'ignored',
                'reason' => 'Admin is logged in'
            ]);
        }

        $ip = $request->ip();
        $userAgent = $request->header('User-Agent', '');
        $url = $request->input('url', $request->fullUrl());
        $path = $request->input('path', $request->path());
        $karyaId = $request->input('karya_id');
        $sessionId = session()->getId();

        // Simple Device Detection
        $deviceType = 'desktop';
        if (preg_match('/(android|bb\d+|meego).+mobile|avail|blackberry|emulator|iphone|ipod|palm|phone|ipad|tablet/i', $userAgent)) {
            if (preg_match('/ipad|tablet|(android(?!.*mobile))/i', $userAgent)) {
                $deviceType = 'tablet';
            } else {
                $deviceType = 'mobile';
            }
        }

        PageView::create([
            'ip_address' => $ip,
            'url' => substr($url, 0, 255),
            'path' => substr($path, 0, 255),
            'karya_id' => $karyaId,
            'session_id' => $sessionId,
            'device_type' => $deviceType,
            'country' => 'Indonesia',
            'city' => null,
            'view_date' => Carbon::today()->toDateString(),
        ]);

        return response()->json(['status' => 'tracked']);
    }


    /**
     * Get Analytics Summary & Charts for Admin Dashboard
     */
    public function getStats()
    {
        $today = Carbon::today()->toDateString();
        $startOfWeek = Carbon::now()->startOfWeek()->toDateString();
        $startOfMonth = Carbon::now()->startOfMonth()->toDateString();

        // 1. Total Hits (Page Views)
        $totalPageViews = PageView::count();
        $todayPageViews = PageView::where('view_date', $today)->count();
        $weekPageViews = PageView::where('view_date', '>=', $startOfWeek)->count();
        $monthPageViews = PageView::where('view_date', '>=', $startOfMonth)->count();

        // 2. Unique Visitors (Unique IP or Session per day)
        $totalUniqueVisitors = PageView::distinct('ip_address')->count('ip_address');
        $todayUniqueVisitors = PageView::where('view_date', $today)->distinct('ip_address')->count('ip_address');
        $weekUniqueVisitors = PageView::where('view_date', '>=', $startOfWeek)->distinct('ip_address')->count('ip_address');
        $monthUniqueVisitors = PageView::where('view_date', '>=', $startOfMonth)->distinct('ip_address')->count('ip_address');

        // 3. Daily Visitor Trend (Last 14 Days)
        $dailyTrend = [];
        for ($i = 13; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i)->toDateString();
            $label = Carbon::today()->subDays($i)->format('d M');
            $views = PageView::where('view_date', $date)->count();
            $visitors = PageView::where('view_date', $date)->distinct('ip_address')->count('ip_address');
            $dailyTrend[] = [
                'date' => $date,
                'label' => $label,
                'views' => $views,
                'visitors' => $visitors,
            ];
        }

        // 4. Monthly Visitor Trend (Last 6 Months)
        $monthlyTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthObj = Carbon::now()->subMonths($i);
            $yearMonth = $monthObj->format('Y-m');
            $label = $monthObj->format('M Y');
            
            $views = PageView::whereYear('created_at', $monthObj->year)
                ->whereMonth('created_at', $monthObj->month)
                ->count();

            $visitors = PageView::whereYear('created_at', $monthObj->year)
                ->whereMonth('created_at', $monthObj->month)
                ->distinct('ip_address')
                ->count('ip_address');

            $monthlyTrend[] = [
                'month' => $yearMonth,
                'label' => $label,
                'views' => $views,
                'visitors' => $visitors,
            ];
        }

        // 5. Most Viewed Portfolio Items (Top 5)
        $topKaryaViews = PageView::whereNotNull('karya_id')
            ->select('karya_id', DB::raw('count(*) as view_count'))
            ->groupBy('karya_id')
            ->orderBy('view_count', 'desc')
            ->limit(10)
            ->get();

        $topKarya = [];
        foreach ($topKaryaViews as $kv) {
            $item = PortfolioItem::find($kv->karya_id);
            if ($item) {
                $topKarya[] = [
                    'id' => $item->id,
                    'title' => $item->title,
                    'category' => $item->category,
                    'subcategory' => $item->subcategory,
                    'cover_image' => $item->cover_image ?: ($item->images[0] ?? $item->image_url),
                    'views' => $kv->view_count
                ];
            }
        }

        // 6. Device Breakdown (Desktop vs Mobile vs Tablet)
        $deviceStats = PageView::select('device_type', DB::raw('count(*) as count'))
            ->groupBy('device_type')
            ->get()
            ->pluck('count', 'device_type')
            ->toArray();

        $desktopCount = $deviceStats['desktop'] ?? 0;
        $mobileCount = $deviceStats['mobile'] ?? 0;
        $tabletCount = $deviceStats['tablet'] ?? 0;
        $totalDevice = max(1, $desktopCount + $mobileCount + $tabletCount);

        $deviceBreakdown = [
            'desktop' => $desktopCount,
            'mobile' => $mobileCount,
            'tablet' => $tabletCount,
            'desktop_pct' => round(($desktopCount / $totalDevice) * 100),
            'mobile_pct' => round(($mobileCount / $totalDevice) * 100),
            'tablet_pct' => round(($tabletCount / $totalDevice) * 100),
        ];

        return response()->json([
            'summary' => [
                'total_views' => $totalPageViews,
                'today_views' => $todayPageViews,
                'week_views' => $weekPageViews,
                'month_views' => $monthPageViews,
                'total_visitors' => $totalUniqueVisitors,
                'today_visitors' => $todayUniqueVisitors,
                'week_visitors' => $weekUniqueVisitors,
                'month_visitors' => $monthUniqueVisitors,
            ],
            'daily_trend' => $dailyTrend,
            'monthly_trend' => $monthlyTrend,
            'top_karya' => $topKarya,
            'device_breakdown' => $deviceBreakdown,
        ]);
    }
}
