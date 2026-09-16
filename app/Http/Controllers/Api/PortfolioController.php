<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PortfolioItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Database\Seeders\DatabaseSeeder;

class PortfolioController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->query('category', 'all');
        $subcategory = $request->query('subcategory', 'all');
        $search = $request->query('searchQuery', '');

        $query = PortfolioItem::query()->orderBy('created_at', 'desc');

        if ($category !== 'all') {
            $query->where('category', $category);
        }

        $items = $query->get();

        // Perform in-memory subcategory and search filter matching frontend logic
        $filtered = $items->filter(function ($item) use ($subcategory, $search) {
            $reqSub = strtolower(trim($subcategory));
            $itemSub = strtolower(trim($item->subcategory ?? ''));

            $matchSubcategory = $subcategory === 'all' ||
                $item->subcategory === $subcategory ||
                str_contains($itemSub, $reqSub) ||
                str_contains($reqSub, $itemSub) ||
                (str_contains($reqSub, 'kemasan') && str_contains($itemSub, 'kemasan')) ||
                (str_contains($reqSub, 'packaging') && str_contains($itemSub, 'kemasan')) ||
                (str_contains($reqSub, 'poster') && str_contains($itemSub, 'poster')) ||
                (str_contains($reqSub, 'banner') && str_contains($itemSub, 'banner')) ||
                (str_contains($reqSub, 'logo') && str_contains($itemSub, 'logo')) ||
                (str_contains($reqSub, 'lainnya') && str_contains($itemSub, 'lainnya')) ||
                (str_contains($reqSub, 'others') && str_contains($itemSub, 'lainnya'));

            $q = strtolower(trim($search));
            $tagsStr = is_array($item->tags) ? implode(' ', $item->tags) : '';
            
            $matchSearch = !$q ||
                str_contains(strtolower($item->title ?? ''), $q) ||
                str_contains(strtolower($item->title_en ?? ''), $q) ||
                str_contains(strtolower($item->description ?? ''), $q) ||
                str_contains(strtolower($item->description_en ?? ''), $q) ||
                str_contains(strtolower($item->subcategory ?? ''), $q) ||
                str_contains(strtolower($item->subcategory_en ?? ''), $q) ||
                str_contains(strtolower($item->category ?? ''), $q) ||
                str_contains(strtolower($item->client ?? ''), $q) ||
                str_contains(strtolower((string)$item->year), $q) ||
                str_contains(strtolower($tagsStr), $q);

            return $matchSubcategory && $matchSearch;
        });

        return response()->json(array_values($filtered->toArray()));
    }

    public function store(Request $request)
    {
        $data = $request->all();
        if (empty($data['id'])) {
            $data['id'] = 'item-' . time() . '-' . Str::random(5);
        }

        $item = PortfolioItem::create($data);
        return response()->json($item, 201);
    }

    public function update(Request $request, $id)
    {
        $item = PortfolioItem::findOrFail($id);
        $item->update($request->all());
        return response()->json($item);
    }

    public function destroy($id)
    {
        $item = PortfolioItem::find($id);
        if ($item) {
            $item->delete();
        }
        return response()->json(['success' => true]);
    }

    public function reset()
    {
        PortfolioItem::truncate();
        Experience::truncate();
        Document::truncate();
        Contact::truncate();
        Certificate::truncate();
        Profile::truncate();

        return response()->json([]);
    }
}
