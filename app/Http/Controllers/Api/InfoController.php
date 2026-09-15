<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Models\Document;
use App\Models\Contact;
use App\Models\Certificate;
use App\Models\Profile;
use Illuminate\Http\Request;
use Database\Seeders\DatabaseSeeder;

class InfoController extends Controller
{
    // --- EXPERIENCES ---
    public function getExperiences()
    {
        return response()->json(Experience::orderBy('created_at', 'desc')->get());
    }

    public function saveExperience(Request $request)
    {
        $data = $request->all();
        if (!empty($data['id'])) {
            $exp = Experience::find($data['id']);
            if ($exp) {
                $exp->update($data);
                return response()->json(Experience::orderBy('created_at', 'desc')->get());
            }
        }

        $data['id'] = $data['id'] ?? 'exp-' . time();
        Experience::create($data);
        return response()->json(Experience::orderBy('created_at', 'desc')->get());
    }

    public function deleteExperience($id)
    {
        $exp = Experience::find($id);
        if ($exp) {
            $exp->delete();
        }
        return response()->json(Experience::orderBy('created_at', 'desc')->get());
    }

    // --- DOCUMENTS ---
    public function getDocuments()
    {
        return response()->json(Document::orderBy('created_at', 'desc')->get());
    }

    public function saveDocument(Request $request)
    {
        $data = $request->all();
        if (!empty($data['id'])) {
            $doc = Document::find($data['id']);
            if ($doc) {
                $doc->update($data);
                return response()->json(Document::orderBy('created_at', 'desc')->get());
            }
        }

        $data['id'] = $data['id'] ?? 'doc-' . time();
        Document::create($data);
        return response()->json(Document::orderBy('created_at', 'desc')->get());
    }

    public function deleteDocument($id)
    {
        $doc = Document::find($id);
        if ($doc) {
            $doc->delete();
        }
        return response()->json(Document::orderBy('created_at', 'desc')->get());
    }

    // --- CONTACTS ---
    public function getContacts()
    {
        return response()->json(Contact::orderBy('created_at', 'desc')->get());
    }

    public function saveContact(Request $request)
    {
        $data = $request->all();
        if (!empty($data['id'])) {
            $contact = Contact::find($data['id']);
            if ($contact) {
                $contact->update($data);
                return response()->json(Contact::orderBy('created_at', 'desc')->get());
            }
        }

        $data['id'] = $data['id'] ?? 'contact-' . time();
        Contact::create($data);
        return response()->json(Contact::orderBy('created_at', 'desc')->get());
    }

    public function deleteContact($id)
    {
        $contact = Contact::find($id);
        if ($contact) {
            $contact->delete();
        }
        return response()->json(Contact::orderBy('created_at', 'desc')->get());
    }

    // --- CERTIFICATES ---
    public function getCertificates()
    {
        return response()->json(Certificate::orderBy('created_at', 'desc')->get());
    }

    public function saveCertificate(Request $request)
    {
        $data = $request->all();
        if (!empty($data['id'])) {
            $cert = Certificate::find($data['id']);
            if ($cert) {
                $cert->update($data);
                return response()->json(Certificate::orderBy('created_at', 'desc')->get());
            }
        }

        $data['id'] = $data['id'] ?? 'cert-' . time();
        Certificate::create($data);
        return response()->json(Certificate::orderBy('created_at', 'desc')->get());
    }

    public function deleteCertificate($id)
    {
        $cert = Certificate::find($id);
        if ($cert) {
            $cert->delete();
        }
        return response()->json(Certificate::orderBy('created_at', 'desc')->get());
    }

    // --- PROFILE ---
    public function getProfile()
    {
        $profile = Profile::first();
        if (!$profile) {
            $seeder = new DatabaseSeeder();
            $seeder->seedProfile();
            $profile = Profile::first();
        }
        return response()->json($profile);
    }

    public function saveProfile(Request $request)
    {
        $profile = Profile::first();
        if (!$profile) {
            $profile = Profile::create($request->all());
        } else {
            $profile->update($request->all());
        }
        return response()->json($profile);
    }

    // RESET ALL INFO
    public function resetAllInfo()
    {
        Experience::truncate();
        Document::truncate();
        Contact::truncate();
        Certificate::truncate();
        Profile::truncate();

        $seeder = new DatabaseSeeder();
        $seeder->seedInfo();

        return response()->json(['success' => true]);
    }
}
