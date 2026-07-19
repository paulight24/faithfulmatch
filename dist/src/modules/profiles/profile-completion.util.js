"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DISCOVERABLE_COMPLETION_THRESHOLD = void 0;
exports.calculateProfileCompletion = calculateProfileCompletion;
function calculateProfileCompletion(profile, approvedPhotoCount) {
    const fields = [
        { label: 'First name', weight: 10, complete: !!profile.firstName },
        { label: 'Birthday', weight: 10, complete: !!profile.birthday },
        { label: 'Gender', weight: 10, complete: !!profile.gender },
        { label: 'Denomination', weight: 10, complete: !!profile.denomination },
        { label: 'Faith level', weight: 10, complete: !!profile.faithLevel },
        { label: 'Marriage intention', weight: 10, complete: !!profile.marriageIntent },
        {
            label: 'Bio (20+ characters)',
            weight: 10,
            complete: !!profile.bio && profile.bio.length >= 20,
        },
        { label: 'City', weight: 10, complete: !!profile.city },
        { label: 'Profile photo', weight: 20, complete: approvedPhotoCount > 0 },
    ];
    const percent = fields.reduce((sum, f) => sum + (f.complete ? f.weight : 0), 0);
    const missing = fields.filter((f) => !f.complete).map((f) => f.label);
    return { percent, missing };
}
exports.DISCOVERABLE_COMPLETION_THRESHOLD = 80;
//# sourceMappingURL=profile-completion.util.js.map