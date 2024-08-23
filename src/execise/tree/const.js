const tree = {
  type: "TaskItem",
  name: "0",
  props: {
    columnsType: "span",
    columnsLayout: "18:6",
    passThrough: [
      {
        field: "selectedPolicyCode",
        value: "{{ctx._fn.handlePolicyValue(ctx.form.policyList, 'code')}}",
      },
      {
        field: "selectedPolicyTitle",
        value:
          "{{[...(ctx.form.policyList.policyChecked || [])].sort((a, b) => a.code > b.code ? 1 : -1).reduce(function(accumulator, item){return accumulator +  ';' + item.code + ',' + item.policy + ';'  ;}, '') || ''}}",
      },
      {
        field: "pipeline_infos",
        value: "{{ctx.task.pipeline_infos}}",
      },
    ],
    showAudit: false,
    customEcho: [],
    filterEmpty: true,
    splitArray: true,
    validate:
      "function validate(ctx) {\r\n    ctx.fn.uploadTack(ctx, {\r\n        ['event_type']: 'overkill_score',\r\n        extra: ctx.task.__tcs?.verifierScore?.overkill_exp\r\n    });\r\n}",
    openRemoteAudit: true,
    usingV4: true,
    arbitrationScence: "TikTok-Video-CC",
    lazyLoad: false,
    arbitrationContext: {},
    style: {
      height: "",
    },
  },
  children: [
    {
      type: "Container",
      name: "a2",
      props: {
        columnsType: "flex",
        direction: "column",
        horizontalAlign: "start",
        verticalAlign: "start",
        fixViewPort: false,
        fixedDistance: 0,
      },
      children: [
        {
          type: "Container",
          name: "ykGoG4bCzU",
          children: [],
          props: {
            direction: "column",
            horizontalAlign: "start",
            verticalAlign: "start",
            fixViewPort: true,
            fixedDistance: 0,
            style: {
              backgroundColor: "",
              width: "",
              borderWidth: "1px",
              borderStyle: "none",
              borderColor: "rgba(var(--grey-3), 1)",
            },
          },
          remark: "Full Watch Info",
          visible: "{{!ctx.fn.isKeyFrameSOPMode(ctx)}}",
        }
      ],
      visible: true,
    },
    {
      type: 'a',
      children: [
        {
          type: 'b'
        },
        {
          type: 'c',
          children: [
            {
              type: 'd',
              children: [
                {
                  type: 'e'
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  events: {
    mounted: [
      {
        action: "customAction",
        params: {
          title: "inited",
          fn: "function customAction(ctx, update) {\r\n    const { new_recommend_policy, policy_recom_output_maxcls = Number.MAX_SAFE_INTEGER, policy_recom_output_mincls = 0, policy_recom_output_thresh = 0, policy_codes } = ctx.task.recommend_policy_info || {};\r\n    // 如果不走动态推荐，继续展示老的推荐Policy\r\n    if (!new_recommend_policy) {\r\n        update('variable', 'recommendPolicy', (ctx.task.cms_info?.recommend_policies || []));\r\n        return;\r\n    }\r\n    // 按分值排好的有序Policy列表\r\n    const codes = Object.keys(policy_codes).sort((a, b) => (policy_codes[b] - policy_codes[a]));\r\n    ;\r\n    const projectId = ctx.task.task_meta?.project_id;\r\n    fetch(`/api/cms2/v2/search_policy_list/?project_id=${projectId}&second_branch=&tag=&policy_list=${codes.join(',')}`)\r\n        .then(res => res.json())\r\n        .then(res => {\r\n        const { code, data } = res;\r\n        if (code !== 200 && code !== 0) {\r\n            return;\r\n        }\r\n        let codeList = [];\r\n        const threshLimitPolicy = data.filter(i => (policy_codes[i?._source?.code] >= policy_recom_output_thresh));\r\n        if (threshLimitPolicy.length < policy_recom_output_mincls) {\r\n            codeList = data.slice(0, policy_recom_output_mincls);\r\n        }\r\n        else if (threshLimitPolicy.length >= policy_recom_output_maxcls) {\r\n            codeList = data.slice(0, policy_recom_output_maxcls);\r\n        }\r\n        else {\r\n            codeList = threshLimitPolicy;\r\n        }\r\n        update('variable', 'recommendPolicy', codeList.map(i => i?._source?.code));\r\n    });\r\n}",
          event: "mounted",
        },
      },
    ],
  },
};

module.exports = {
  tree,
};
