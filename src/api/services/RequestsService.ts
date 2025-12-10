/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AbandonDto } from '../models/AbandonDto';
import type { AddBountyDto } from '../models/AddBountyDto';
import type { ApproveSubmissionDto } from '../models/ApproveSubmissionDto';
import type { CancelDto } from '../models/CancelDto';
import type { ClaimDto } from '../models/ClaimDto';
import type { CommentCreateDto } from '../models/CommentCreateDto';
import type { CommentsListDto } from '../models/CommentsListDto';
import type { CreateRequestDto } from '../models/CreateRequestDto';
import type { DetailDto } from '../models/DetailDto';
import type { DisputesDecideDto } from '../models/DisputesDecideDto';
import type { DisputesDetailDto } from '../models/DisputesDetailDto';
import type { DisputesListDto } from '../models/DisputesListDto';
import type { DisputesRequestEvidenceDto } from '../models/DisputesRequestEvidenceDto';
import type { ListRequestsDto } from '../models/ListRequestsDto';
import type { PendingSubmissionsDto } from '../models/PendingSubmissionsDto';
import type { PublishDto } from '../models/PublishDto';
import type { RejectSubmissionDto } from '../models/RejectSubmissionDto';
import type { RepublishDto } from '../models/RepublishDto';
import type { ResubmitDto } from '../models/ResubmitDto';
import type { SaveDraftDto } from '../models/SaveDraftDto';
import type { SubmitDto } from '../models/SubmitDto';
import type { UpdateRequestDto } from '../models/UpdateRequestDto';
import type { UpvoteDto } from '../models/UpvoteDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RequestsService {
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsControllerList(
        requestBody: ListRequestsDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsControllerDetail(
        requestBody: DetailDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/detail',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsControllerCreate(
        requestBody: CreateRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/create',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsControllerSaveDraft(
        requestBody: SaveDraftDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/save-draft',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsControllerUpdate(
        requestBody: UpdateRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/update',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsControllerPublish(
        requestBody: PublishDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/publish',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsControllerCancel(
        requestBody: CancelDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/cancel',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsControllerRepublish(
        requestBody: RepublishDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/republish',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsControllerAddBounty(
        requestBody: AddBountyDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/add-bounty',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsControllerClaim(
        requestBody: ClaimDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/claim',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsControllerAbandon(
        requestBody: AbandonDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/abandon',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsControllerSubmit(
        requestBody: SubmitDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/submit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsControllerResubmit(
        requestBody: ResubmitDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/resubmit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsControllerApproveSubmission(
        requestBody: ApproveSubmissionDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/approve-submission',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsControllerRejectSubmission(
        requestBody: RejectSubmissionDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/reject-submission',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsControllerPendingSubmissions(
        requestBody: PendingSubmissionsDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/pending-submissions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static requestsControllerMyList(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/my/list',
        });
    }
    /**
     * @returns any
     * @throws ApiError
     */
    public static requestsControllerMyResponses(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/my-responses/list',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsCommentsControllerList(
        requestBody: CommentsListDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/comments/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsCommentsControllerCreate(
        requestBody: CommentCreateDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/comments/create',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsVotesControllerUpvote(
        requestBody: UpvoteDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/votes/upvote',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsDisputesControllerList(
        requestBody: DisputesListDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/disputes/list',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsDisputesControllerDetail(
        requestBody: DisputesDetailDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/disputes/detail',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsDisputesControllerDecide(
        requestBody: DisputesDecideDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/disputes/decide',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestsDisputesControllerRequestEvidence(
        requestBody: DisputesRequestEvidenceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/requests/disputes/request-evidence',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
