<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Processed Candidate Listings in Repository</p>
    </header>
    <section class="modal-card-body">
      <b-field grouped group-multiline>
        <b-button
          label="Delete checked"
          type="is-danger is-rounded"
          icon-left="close"
          class="field"
          @click="deleteRows"
          v-if="checkedRows.length"
        />
      </b-field>
      <b-tabs>
        <b-tab-item label="Table">
          <b-table :data="candidateList" focusable striped>
            <b-table-column field="id" label="ID" v-slot="props">{{ props.row.id }}</b-table-column>
            <b-table-column field="name" label="Candidate's name" v-slot="props">{{
              props.row.name.split('$')[0]
            }}</b-table-column>
            <b-table-column field="datasets" label="Active datasets" v-slot="props">{{
              props.row.datasets
            }}</b-table-column>
            <b-table-column>
              <template v-slot:default="{ row }">
                <b-field>
                  <b-button
                    type="is-danger is-rounded"
                    icon-left="trash-can"
                    style="margin-right: 5px"
                    @click="deleteRow(row)"
                  ></b-button>
                  <b-button
                    type="is-primary is-rounded"
                    icon-left="animation"
                    @click="initSpace(row.name)"
                    >Load</b-button
                  >
                </b-field>
              </template>
            </b-table-column>
            <template #empty>
              <div class="has-text-centered">
                {{ isLoading ? 'Loading...' : 'No records' }}
              </div>
            </template>
          </b-table>
        </b-tab-item>
        <b-tab-item label="Entry">
          <b-field label="Candidate's name">
            <b-input ref="candNameTextbox" v-model="candidate" :title="candidate"></b-input>
          </b-field>
          <b-button
            @click="initSpace(`${candidate}$${selectedProg}`)"
            icon-left="check"
            type="is-primary is-rounded"
            >Add</b-button
          >
        </b-tab-item>
      </b-tabs>
    </section>
    <footer class="modal-card-foot">
      <b-button icon-left="close" type="is-rounded" @click="$parent.close()">
        Close
      </b-button>
    </footer>
  </div>
</template>

<script>
import { deleteCandidate, getCandidates } from '../services/api';

export default {
  props: {
    selectedProg: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      checkedRows: [],
      candidate: '',
      candidateList: [],
      isLoading: false,
    };
  },
  mounted() {
    this.isLoading = true;
    getCandidates(this.selectedProg).then((data) => {
      this.isLoading = false;
      this.candidateList = data;
    });
  },
  methods: {
    async initSpace(val) {
      this.$emit('init-space', val);
      this.$parent.close();
    },
    deleteRow(row) {
      this.$buefy.dialog.confirm({
        title: 'Deleting candidate',
        message: `Are you sure you want to <b>delete</b> this candidate? This action cannot be undone.`,
        confirmText: 'Delete Candidate',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          await deleteCandidate(row.name).then((data) => (this.candidateList = data));

          this.$buefy.toast.open('Candidate deleted!');
        },
      });
    },
  },
};
</script>
